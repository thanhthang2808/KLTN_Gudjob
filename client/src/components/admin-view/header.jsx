import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast"; 

function AdminHeader({ setOpen }) {
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logoutUser()).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                    type: "success", 
                });
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: "destructive", 
                });
            }
        });
    }

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
            <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
                <AlignJustify />
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex flex-1 justify-end">
                <Button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                    <LogOut size={24} />
                    Logout
                </Button>
            </div>
        </header>
    );
}

export default AdminHeader;
