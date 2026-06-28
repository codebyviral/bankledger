import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader } from "lucide-react";
import type { FC } from "react"

interface DialogProps {
    state: boolean;
    loading: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const Dialog: FC<DialogProps> = (props) => {
    return (
        <div>
            <AlertDialog open={props.state} onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Confirm Transfer
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {/* Transfer ₹{transaction.amount} to {transaction.email}? */}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className='h-auto'>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction disabled={props.loading} onClick={props.onContinue}>
                            {props.loading ? (<div className="animate-spin"><Loader /></div>) : ('Continue')}
                        </AlertDialogAction>
                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}

export default Dialog
