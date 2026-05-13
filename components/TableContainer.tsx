import { Table } from './ui/table'

export default function TableContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-1 bg-accent pt-3 rounded-xl border">
            <div className="rounded-lg p-3 overflow-hidden bg-white">
                <Table className="overflow-hidden">
                    {children}
                </Table>
            </div>
        </div>
    )
}
