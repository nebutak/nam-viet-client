import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { normalizeText } from "@/utils/normalize-text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon } from "lucide-react";

export default function MaterialSelectionDialog({
  open,
  onOpenChange,
  materials = [],
  initialSelectedIds = [],
  onConfirm,
}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setSelected(initialSelectedIds || []);
      setSearch("");
    }
  }, [open, initialSelectedIds]);

  const filteredMaterials = materials.filter(
    (m) =>
      (m.productName && normalizeText(m.productName).includes(normalizeText(search))) ||
      (m.code && normalizeText(m.code).includes(normalizeText(search)))
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Chọn nguyên liệu sử dụng</DialogTitle>
        </DialogHeader>

        <div className="relative my-2">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã nguyên liệu..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[40vh] border rounded-md p-4">
          {filteredMaterials.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Không tìm thấy nguyên liệu nào
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mat-${material.id}`}
                    checked={selected.includes(material.id)}
                    onCheckedChange={() => toggleSelect(material.id)}
                  />
                  <label
                    htmlFor={`mat-${material.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {material.productName} <span className="text-muted-foreground">({material.code})</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>
            Xác nhận (Đã chọn {selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
