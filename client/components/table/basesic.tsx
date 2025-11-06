import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export function BasicTable({
    fields,
    data,
    emptyText = "No data",
}: {
    fields: {
        key: string;
        label: string;
    }[];
    data: any[];
    emptyText?: string;
}) {
    return (
        <div className="max-h-96 overflow-auto bg-background rounded-lg border border-border">
            <Table>
                <TableHeader >
                    <TableRow>
                        {fields.map((field) => (
                            <TableHead key={field.key}>{field.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            {fields.map((field) => (
                                <TableCell key={field.key}>{item[field.key]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={fields.length} className="text-center">{emptyText}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
