import { useState } from "react";
import Modal from "./Modal";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Hapus" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (busy) return;
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="mt-3 space-y-4">
        <p className="text-sm text-stone-600">{message}</p>
        <Alert>{error}</Alert>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={handleClose} disabled={busy}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={busy}>
            {busy && <Spinner size={16} />}
            {busy ? "Menghapus..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
