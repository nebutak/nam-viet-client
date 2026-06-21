import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'

import api from '@/utils/axios'
import { getPermission } from '@/stores/PermissionSlice'
import { getUsers } from '@/stores/UserSlice'
import { handleError } from '@/utils/handle-error'
import { Button } from '@/components/custom/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const UpdateEmployeePermissionsDialog = ({
  user,
  open,
  onOpenChange,
}) => {
  const dispatch = useDispatch()
  const permissionsTree = useSelector((state) => state.permission.permissions)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const [rolePermissionSet, setRolePermissionSet] = useState(new Set())
  const [directByCode, setDirectByCode] = useState({})
  const [checkedCodes, setCheckedCodes] = useState(new Set())

  const allPermissions = useMemo(() => {
    const root = permissionsTree?.[0]
    if (!root?.items) return []

    return root.items.map((module) => ({
      key: module.key,
      label: module.label,
      permissions: module.permissions || [],
    }))
  }, [permissionsTree])

  const permissionCodeToId = useMemo(() => {
    const map = {}
    allPermissions.forEach((module) => {
      module.permissions.forEach((permission) => {
        map[permission.code] = permission.id
      })
    })
    return map
  }, [allPermissions])

  const filteredModules = useMemo(() => {
    const q = normalize(search)
    if (!q) return allPermissions

    return allPermissions
      .map((module) => {
        const matchedPermissions = module.permissions.filter((permission) =>
          [permission.name, permission.code, module.label].some((value) =>
            normalize(value).includes(q)
          )
        )

        return {
          ...module,
          permissions: matchedPermissions,
        }
      })
      .filter((module) => module.permissions.length > 0)
  }, [allPermissions, search])

  useEffect(() => {
    if (!open || !user?.id) return

    let mounted = true
    const loadData = async () => {
      setLoading(true)
      try {
        if (!permissionsTree?.length) {
          await dispatch(getPermission()).unwrap()
        }

        const [directRes, effectiveRes] = await Promise.all([
          api.get(`/users/${user.id}/permissions`),
          api.get(`/users/${user.id}/permissions/effective`),
        ])

        if (!mounted) return

        const directPermissions = directRes.data?.data || []
        const effective = effectiveRes.data?.data || {}

        const nextDirectByCode = {}
        directPermissions.forEach((item) => {
          nextDirectByCode[item.permissionKey] = {
            permissionId: item.permissionId,
            grantType: item.grantType,
          }
        })

        setDirectByCode(nextDirectByCode)
        setRolePermissionSet(new Set(effective.rolePermissions || []))
        setCheckedCodes(new Set(effective.effectivePermissions || []))
      } catch (error) {
        toast.error(handleError(error).message || 'Không thể tải dữ liệu quyền')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [dispatch, open, permissionsTree?.length, user?.id])

  const togglePermission = (permissionCode, checked) => {
    setCheckedCodes((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(permissionCode)
      } else {
        next.delete(permissionCode)
      }
      return next
    })
  }

  const getPermissionState = (permissionCode) => {
    const hasRolePermission = rolePermissionSet.has(permissionCode)
    const hasEffectivePermission = checkedCodes.has(permissionCode)

    if (hasRolePermission && hasEffectivePermission) return 'role'
    if (!hasRolePermission && hasEffectivePermission) return 'grant'
    if (hasRolePermission && !hasEffectivePermission) return 'revoke'
    return 'none'
  }

  const handleSave = async () => {
    if (!user?.id) return

    setSaving(true)
    try {
      const operations = []
      const allCodes = Object.keys(permissionCodeToId)

      allCodes.forEach((code) => {
        const permissionId = permissionCodeToId[code]
        const direct = directByCode[code]
        const roleHas = rolePermissionSet.has(code)
        const checked = checkedCodes.has(code)

        if (checked) {
          if (roleHas) {
            if (direct?.grantType === 'revoke') {
              operations.push({
                type: 'delete',
                permissionId,
              })
            }
          } else if (!direct || direct.grantType !== 'grant') {
            operations.push({
              type: 'upsert',
              permissionId,
              grantType: 'grant',
            })
          }
        } else if (roleHas) {
          if (!direct || direct.grantType !== 'revoke') {
            operations.push({
              type: 'upsert',
              permissionId,
              grantType: 'revoke',
            })
          }
        } else if (direct?.grantType === 'grant') {
          operations.push({
            type: 'delete',
            permissionId,
          })
        }
      })

      await Promise.all(
        operations.map((op) => {
          if (op.type === 'delete') {
            return api.delete(`/users/${user.id}/permissions/${op.permissionId}`)
          }
          return api.post(`/users/${user.id}/permissions`, {
            permissionId: op.permissionId,
            grantType: op.grantType,
          })
        })
      )

      toast.success('Cập nhật quyền nhân viên thành công')
      onOpenChange?.(false)
      dispatch(getUsers())
    } catch (error) {
      toast.error(handleError(error).message || 'Cập nhật quyền thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            Sửa quyền: {user?.fullName || user?.employeeCode}
          </DialogTitle>
          <DialogDescription>
            Quyền sẽ được tùy chỉnh theo từng nhân viên, có thể khác vai trò mặc định.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên quyền hoặc mã quyền..."
              className="max-w-md"
            />
            <div className="text-xs text-muted-foreground">
              `Theo vai trò` / `Cấp thêm` / `Thu hồi`
            </div>
          </div>

          <div className="max-h-[60vh] overflow-auto rounded-xl border p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải quyền...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredModules.map((module) => (
                  <div key={module.key} className="rounded-lg border p-3">
                    <div className="mb-3 border-b pb-2 text-sm font-semibold text-slate-800">
                      {module.label}
                    </div>

                    <div className="space-y-2">
                      {module.permissions.map((permission) => {
                        const state = getPermissionState(permission.code)

                        return (
                          <div
                            key={permission.id}
                            className="flex items-start justify-between gap-3 rounded-md border px-3 py-2"
                          >
                            <div className="flex items-start gap-2">
                              <Checkbox
                                id={`employee-permission-${permission.id}`}
                                checked={checkedCodes.has(permission.code)}
                                onCheckedChange={(checked) =>
                                  togglePermission(permission.code, !!checked)
                                }
                              />
                              <div className="leading-tight">
                                <Label
                                  htmlFor={`employee-permission-${permission.id}`}
                                  className="cursor-pointer text-sm font-medium"
                                >
                                  {permission.name}
                                </Label>
                                <div className="text-xs text-muted-foreground">
                                  {permission.code}
                                </div>
                              </div>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                state === 'grant'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : state === 'revoke'
                                  ? 'bg-rose-100 text-rose-700'
                                  : state === 'role'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {state === 'grant'
                                ? 'Cấp thêm'
                                : state === 'revoke'
                                ? 'Thu hồi'
                                : state === 'role'
                                ? 'Theo vai trò'
                                : 'Không có'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {filteredModules.length === 0 && (
                  <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                    Không tìm thấy quyền phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} loading={saving || loading}>
            Lưu quyền
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateEmployeePermissionsDialog
