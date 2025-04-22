
import { Toast, useToast as useToastOriginal } from "@/components/ui/toast";

export type ToasterToast = Toast;

export const useToast = useToastOriginal;
export { toast } from "@/components/ui/use-toast";
