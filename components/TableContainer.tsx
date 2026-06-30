import { Table } from './ui/table'

export default function TableContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-0.5 bg-accent rounded-lg border">
            <div className="rounded-md p-3 overflow-hidden bg-white">
                <Table className="overflow-hidden">
                    {children}
                </Table>
            </div>
        </div>
    )
}
