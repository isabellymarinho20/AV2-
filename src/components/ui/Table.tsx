import type { ReactNode } from 'react'

type TableCellObj = { content: ReactNode; mono?: boolean }
type TableCell    = string | number | TableCellObj

export interface TableRow {
  _onClick?: () => void
  cells: TableCell[]
}

interface TableProps {
  headers: string[]
  rows:    TableRow[]
  empty?:  string
}

function renderCell(cell: TableCell): ReactNode {
  if (typeof cell === 'object' && 'content' in cell) return cell.content
  return cell
}

function isMono(cell: TableCell): boolean {
  return typeof cell === 'object' && 'mono' in cell ? (cell.mono ?? false) : false
}

export default function Table({ headers, rows, empty = 'Nenhum registro encontrado.' }: TableProps) {
  if (!rows.length) return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9ca3af' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{empty}</div>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #f1f3f7' }}>
            {headers.map(h => (
              <th key={h} style={{
                padding: '10px 16px', textAlign: 'left',
                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ borderBottom: '1px solid #f8f9fb', cursor: row._onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
              onMouseEnter={e => { if (row._onClick) (e.currentTarget as HTMLTableRowElement).style.background = '#fafbfc' }}
              onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
              onClick={row._onClick}
            >
              {row.cells.map((cell, j) => (
                <td key={j} style={{
                  padding: '12px 16px', verticalAlign: 'middle', color: '#374151',
                  fontFamily: isMono(cell) ? 'JetBrains Mono, monospace' : 'inherit',
                  fontSize: isMono(cell) ? 12 : 13,
                }}>
                  {renderCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
