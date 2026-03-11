import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const PermissionDebug = () => {
  const permissions = JSON.parse(localStorage.getItem('permissionCodes') || '[]');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Quyền cần thiết cho trang Báo cáo Tồn kho
  const requiredPermissions = {
    'GET_CATEGORY': {
      name: 'Xem danh mục',
      api: '/api/categories',
      status: permissions.includes('GET_CATEGORY')
    },
    'GET_INVENTORY_REPORT': {
      name: 'Xem báo cáo tồn kho',
      api: '/api/reports/inventory',
      status: permissions.includes('GET_INVENTORY_REPORT')
    }
  };

  const hasAllPermissions = requiredPermissions['GET_CATEGORY'].status && 
                            requiredPermissions['GET_INVENTORY_REPORT'].status;

  return (
    <div className="space-y-4 mb-6">
      {/* Thông báo tổng quan */}
      {!hasAllPermissions && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Bạn chưa có đủ quyền để sử dụng trang này</div>
            <div className="text-sm">
              Vui lòng liên hệ quản trị viên để được cấp quyền. Các quyền cần thiết:
              <ul className="list-disc list-inside mt-2 space-y-1">
                {!requiredPermissions['GET_CATEGORY'].status && (
                  <li>GET_CATEGORY - Xem danh mục</li>
                )}
                {!requiredPermissions['GET_INVENTORY_REPORT'].status && (
                  <li>GET_INVENTORY_REPORT - Xem báo cáo tồn kho</li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Debug panel - chỉ hiện khi dev */}
      {import.meta.env.DEV && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Debug: Thông tin quyền (chỉ hiện ở môi trường dev)
          </div>
          
          <div className="space-y-3 text-sm">
            {/* Thông tin user */}
            <div>
              <div className="font-medium text-gray-700">User:</div>
              <div className="text-gray-600">
                {user.fullName || 'N/A'} ({user.email || 'N/A'})
              </div>
              <div className="text-gray-600">
                Role: {user.role?.roleName || 'N/A'}
              </div>
            </div>

            {/* Kiểm tra quyền */}
            <div>
              <div className="font-medium text-gray-700 mb-2">Quyền cần thiết:</div>
              <div className="space-y-2">
                {Object.entries(requiredPermissions).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    {value.status ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className={value.status ? 'text-green-700' : 'text-red-700'}>
                        <span className="font-mono text-xs">{key}</span>
                      </div>
                      <div className="text-gray-600 text-xs">
                        {value.name} - API: {value.api}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tất cả quyền của user */}
            <div>
              <div className="font-medium text-gray-700 mb-2">
                Tất cả quyền hiện có ({permissions.length}):
              </div>
              <div className="max-h-60 overflow-y-auto bg-white p-2 rounded border scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {permissions.map((perm, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-xs">Không có quyền nào</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionDebug;
