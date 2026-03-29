import { toast } from "sonner";
import { CheckCircle, XCircle, Bell, MessageSquare } from "lucide-react";

interface ToastMessageProps {
  type: "success" | "error" | "notification" | "chatMessage";
  title: string;
  description: string;
}

const ToastMessage = ({ type, title, description }: ToastMessageProps) => {
  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    notification: <Bell className="h-5 w-5 text-blue-500" />,
    chatMessage: <MessageSquare className="h-5 w-5 text-purple-500" />,
  };

  const styleMap = {
    success: "border-green-500 bg-background",
    error: "border-red-500 bg-background",
    notification: "border-blue-500 bg-background",
    chatMessage: "border-slate-500 bg-background",
  };

  toast.custom(() => (
    <div
      className={`flex items-start gap-3 w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg animate-fade-in ${styleMap[type]}`}
    >
      <div className="pt-1">{iconMap[type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  ));


  return null;
};

export default ToastMessage;