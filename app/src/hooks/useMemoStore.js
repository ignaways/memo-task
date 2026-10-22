import { useContext } from "react";
import { MemoContext } from "../context/MemoContext";

export default function useMemoStore() {
  const context = useContext(MemoContext);
  if (!context) throw new Error("useMemoStore must be used within MemoProvider");
  return context;
}
