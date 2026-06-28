import { Button } from "@/components/ui/button"
import { createTransaction } from "@/service/transaction-service"
import { ArrowRight, IndianRupee, Mail, Pen } from "lucide-react"
import { useState } from "react"
import { v7 as uuidv7 } from "uuid"
import { Dialog } from "@/components/component.index"
import { toast } from "sonner"

const FundTransfer = () => {

    const [transaction, settransaction] = useState<{
        email: string;
        amount: number;
        note: string;
    }>({
        email: '',
        amount: 0,
        note: ''
    })

    const [confirm, setConfirm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        const name = e.target.name;
        const value = e.target.value;

        settransaction(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setConfirm(true)
    }

    async function handleContinue() {
        setLoading(true);
        try {
            const idempotencyKey = uuidv7();
            const response = await createTransaction(transaction.email, transaction.amount, idempotencyKey, transaction.note)
            toast(response.data.message)
        } catch (error: any) {
            toast(error.response.data.message)
        } finally {
            setLoading(false);
            setConfirm(false);
        }
    }

    return (
        <div>
            <Dialog state={confirm} loading={loading} onClose={() => setConfirm(false)} onContinue={handleContinue} />
            <div className="flex flex-col items-center h-screen md:mt-20 mt-10 dark:text-white">
                <h1 className="text-3xl dark:text-white">Fund Transfer</h1>
                <p className="dark:text-white mt-4">Send money securely to any account</p>
                <form onSubmit={handleSubmit} className="mt-10 flex flex-col">
                    <h1 className="uppercase mb-2">Recipient email id</h1>
                    <div className="flex items-center gap-2 p-2 rounded border">
                        <label htmlFor="email"><Mail /></label>
                        <input onChange={(e) => handleChange(e)} name='email' required type="email" placeholder="johndoe@example.com" className="p-2 md:w-100 w-80 rounded" autoFocus />
                    </div>
                    <br />
                    <h1 className="uppercase mb-2">amount</h1>
                    <div className="flex items-center gap-2 p-2 rounded border">
                        <label htmlFor="email"><IndianRupee /></label>
                        <input onChange={(e) => handleChange(e)} name="amount" required type="number" min='1' placeholder="0.00" className="p-2 md:w-100 w-80 rounded" />
                    </div>
                    <br />
                    <h1 className="uppercase mb-2">note</h1>
                    <div className="flex items-center gap-2 p-2 rounded border">
                        <label htmlFor="email"><Pen /></label>
                        <input onChange={(e) => handleChange(e)} name="note" required type="text" placeholder="Add a note" className="p-2 md:w-100 w-80 rounded" />
                    </div>
                    <div className="mt-10">
                        <Button type="submit" className='md:w-115 w-auto text-lg flex'>Confirm transfer <ArrowRight className="ml-1" /></Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FundTransfer
