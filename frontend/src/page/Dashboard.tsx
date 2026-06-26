import { Button } from "@/components/ui/button"
import { fetchBalance, fetchMonthlySpending } from "@/service/balance.service"
import { fetchRecentTransactions } from "@/service/transaction-service"
import formatCurrency from "@/utils/format-currency"
import { PlusIcon, Send } from "lucide-react"
import { useEffect, useState } from "react"

type Transaction = {
    _id: string;
    amount: number;
    fromAccount: string;
    toAccount: string;
    note?: string;
}

const Dashboard = () => {

    const [userDetails, setuserDetails] = useState<{
        balance: number,
        transactions: Transaction[]
        monthlySpent: number
    }>({
        balance: 0,
        transactions: [],
        monthlySpent: 0,
    })
    /**
     * Fetch user balance
     */
    useEffect(() => {
        async function getBalance() {
            const response = await fetchBalance();
            setuserDetails(prev => ({
                ...prev,
                balance: response.data.balance
            }))
        }
        async function getTransactions() {
            const response = await fetchRecentTransactions();
            setuserDetails(prev => ({
                ...prev,
                transactions: response.data.recentTransactions
            }))
        }
        async function getMonthlySpend() {
            const response = await fetchMonthlySpending();
            setuserDetails(prev => ({
                ...prev,
                monthlySpent: response.data.totalSpent
            }))
        }
        getBalance();
        getTransactions();
        getMonthlySpend();
    }, [])
    return (
        <>
            <div className="m-10">
                <div className="flex md:gap-15 justify-center">
                    <div className="md:w-200 md:h-80 h-60 w-90 md:mt-10 absolute md:left-20 border p-5 rounded">
                        <div className="md:text-2xl uppercase mb-10">current balance</div>
                        <h1 className="md:text-6xl text-4xl dark:text-white">{formatCurrency(userDetails.balance)}</h1>
                        <div className="absolute md:bottom-0 p-2 md:pb-10 mt-7 flex">
                            <Button className='md:w-30 md:text-lg md:px-20 h-10 capitalize'> <PlusIcon /> Add funds</Button>
                            <Button variant='outline' className='md:w-30 md:text-lg h-10 ml-10 rounded dark:text-white'> <Send /> Send</Button>
                        </div>
                    </div>
                    <div className="md:w-70 w-90 h-auto md:mt-10 absolute md:right-20 border p-5 rounded mt-65">
                        <div className="text-2xl uppercase mb-10">monthly spending</div>
                        <h1 className="text-3xl dark:text-white">{formatCurrency(userDetails.monthlySpent)}</h1>
                        <div className="flex mt-5 text-[#d97757]">
                            {/* <TrendingUp /> <p className="mx-2">+12% from last month</p> */}
                            <p className="capitalize">{new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="md:h-auto md:w-auto absolute top-120 md:left-20 mt-30 md:mt-10">
                        <div className="flex items-center">
                            <h1 className="md:text-xl uppercase">recent transactions</h1>
                            <div className="absolute right-0 cursor-pointer">View all</div>
                        </div>
                        <hr className="mt-2 md:w-300 w-90" />
                        <div className="flex flex-col gap-15 mt-10">
                            {
                                userDetails.transactions.map((item, index) => {
                                    return <div key={index}>
                                        <div className="border p-2 rounded">
                                            <div className="flex">
                                                Trxn ID:
                                                <p className="ml-2 uppercase">
                                                    {item._id.slice(-6)}
                                                </p>
                                                <h1 className="absolute right-0 dark:text-white p-2">{formatCurrency(item.amount)}</h1>
                                            </div>
                                            <div>
                                                <p>From Acc: <span className="uppercase">{item.fromAccount.slice(-6)}</span></p>
                                                <p>To Acc: <span className="uppercase">{item.toAccount.slice(-6)}</span></p>
                                                {
                                                    item.note ? (<><p>Note: <span className="uppercase">{item?.note}</span></p></>) : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
