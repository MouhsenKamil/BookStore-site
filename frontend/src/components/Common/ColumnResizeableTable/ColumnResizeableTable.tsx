import { MouseEvent, ReactNode, Ref, useCallback, useEffect, useRef, useState } from "react"


interface ColumnResizeableTableProps {
  headers: React.ReactNode
  minCellWidth: number
  tableBody: ReactNode
}

interface ColumnProps {
  ref: Ref<HTMLTableHeaderCellElement>
  elem: ReactNode
}

const createHeaders = (headers) => {
  return headers.map(item => ({
    text: item,
    ref: useRef(),
  }));
}

export function ColumnResizeableTable(
  { headers, minCellWidth, tableBody }: ColumnResizeableTableProps
) {
  const [tableHeight, setTableHeight] = useState("auto")
  const [activeIndex, setActiveIndex] = useState(null)
  const tableElement = useRef<HTMLTableElement>(null)
  const columns = createHeaders(headers)

  const mouseDown = index => {
    setActiveIndex(index)
  }

  const mouseMove = useCallback((e) => {
    const gridColumns = columns.map((col, i) => {
      if (i === activeIndex) {
        const width = e.clientX - col.ref.current.offsetLeft

        if (width >= minCellWidth)
          return `${width}px`
      }

      // Otherwise return the previous width (no changes)
      return `${col.ref.current.offsetWidth}px`
    })
  }, [activeIndex, columns, minCellWidth])

  const removeListeners = useCallback(() => {
    window.removeEventListener('mousemove', mouseMove)
    window.removeEventListener('mouseup', removeListeners)
  }, [mouseMove])


  const mouseUp = useCallback(() => {
    setActiveIndex(null)
    removeListeners()
  }, [setActiveIndex, removeListeners])


  useEffect(() => {
    setTableHeight(tableElement.current?.offsetHeight)
  }, [])

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove)
      window.addEventListener('mouseup', mouseUp)
    }

    return () => {
      removeListeners()
    }
  }, [activeIndex, mouseMove, mouseUp, removeListeners])


  return (
    <div className="table-wrapper">
      <table ref={tableElement}>
        <thead>
          <tr>
            {columns.map(({ ref, elem }: ColumnProps, i: number) => (
              <th ref={ref} key={i}>
                {elem}
                <div
                  style={{ height: tableHeight }}
                  onMouseDown={() => mouseDown(i)}
                  className={`resize-handle ${activeIndex === i ? 'active' : 'idle'}`}
                />
              </th>
            ))}
          </tr>
        </thead>
        {tableBody}
      </table>
    </div>
  )
}
