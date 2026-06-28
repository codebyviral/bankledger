import { instance } from "@/api/api-client"
import { useEffect, useState } from "react"
import formatCurrency from "@/utils/format-currency"
import { Button } from "@/components/ui/button"

// ── Types ────────────────────────────────────────────────────────────────────

type LedgerEntry = {
  _id: string
  account: string
  amount: number
  transaction: string
  type: "CREDIT" | "DEBIT"
  createdAt?: string
  updatedAt?: string
  __v: number
}

const Passbook = () => {
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL")

  useEffect(() => {
    const fetchLedger = async () => {
      const response = await instance.get("/api/ledger/")
      return response
    }
    async function getLedger() {
      try {
        const response = await fetchLedger()
        setLedger(response.data.data)
      } catch (error) {
        console.error("Failed to fetch ledger:", error)
      } finally {
        setLoading(false)
      }
    }
    getLedger()
  }, [])

  const filtered = filter === "ALL" ? ledger : ledger.filter(e => e.type === filter)

  // ── Helpers ────────────────────────────────────────────────────────────

  function formatDate(dateStr?: string) {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  function formatTime(dateStr?: string) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="m-10 dark:text-white">
      {/* ── Ledger Section ── */}
      <div className="flex items-center mb-2">
        <h1 className="md:text-xl uppercase">passbook</h1>
        <div className="ml-auto flex gap-2">
          {(["ALL", "CREDIT", "DEBIT"] as const).map(tab => (
            <Button
              key={tab}
              variant={filter === tab ? "default" : "outline"}
              onClick={() => setFilter(tab)}
              className={`h-10 px-3 text-xs uppercase rounded dark:text-white`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
      <hr className="mb-6" />

      <div className="flex flex-col gap-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border p-4 rounded animate-pulse h-20"
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="border p-10 rounded text-center text-gray-500 dark:text-gray-400 uppercase text-sm">
            no transactions found
          </div>
        ) : (
          filtered.map((entry) => (
            <div key={entry._id} className="border p-4 rounded relative lg:text-base text-sm">
              <div className="flex items-center">
                <p className="">
                  Trxn ID: <span className="uppercase">{entry.transaction.slice(-6)}</span>
                </p>
                <h1
                  className={`absolute right-4 top-4 ${entry.type === "CREDIT"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                    }`}
                >
                  {entry.type === "CREDIT" ? "+" : "−"} {formatCurrency(entry.amount)}
                </h1>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {entry.createdAt && (
                  <p>
                    <span className="uppercase">
                      {formatDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Passbook