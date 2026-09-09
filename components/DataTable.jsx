"use client";
import { React, useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterDepartment from "./FilterDepartment";
import FilterShortlisted from "./FilterShortlisted";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./ui/button";
import { CheckBoxComp } from "./CheckBoxComp";
import { toast } from "sonner";
import { curDate, curDay, curMonth, curYear, months, days } from "@/constants";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useRowSelect,
} from "react-table";
import { Input } from "@/components/ui/input";
import PaginationComp from "./PaginationComp";
import { CSVLink } from "react-csv";
import Link from "next/link";
import { CSV_Header } from "@/constants";

const DataTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  const [deptFiltered, setDeptFiltered] = useState(data);
  const [shortFiltered, setShortFiltered] = useState(data);
  const [applicantTotalCount, setApplicantTotalCount] = useState(0);
  const [shortlistedApplicantCount, setShortlistedApplicantCount] = useState(0);
  const [pipelineProcessingTick, setPipelineProcessingTick] = useState(0);
  const [filterTelemetryReport, setFilterTelemetryReport] = useState("");

  const commonElements = (arr1, arr2) => {
    let common = [];
    arr1.map((elt1) => {
      arr2.map((elt2) => {
        if (elt1 === elt2) {
          common.push(elt1);
        }
      });
    });
    return common;
  };

  const filterFunc = (dept) => {
    setDeptFiltered(data);
    const filteredData = data.filter((applicant) => {
      return applicant.applications.some(app => app.Department === dept);
    });
    setDeptFiltered(filteredData);
  };

  const shortlistedFilterFunc = (status) => {
    const isShortlistedStatus = status === "true";
    const filteredData = data.filter((applicant) => {
      const isShortlisted = applicant.applications.some(app => app.shortlisted);
      return String(isShortlisted) === status;
    });

    setShortFiltered(filteredData);
  };

  // Pipeline Step 1: Filter reconciliation
  useEffect(() => {
    if (deptFiltered !== data && shortFiltered !== data) {
      setTableData(commonElements(deptFiltered, shortFiltered));
    } else if (deptFiltered !== data && shortFiltered === data) {
      setTableData(deptFiltered);
    } else if (deptFiltered === data && shortFiltered !== data) {
      setTableData(shortFiltered);
    } else {
      setTableData(data);
    }
  }, [deptFiltered, shortFiltered]);

  // Pipeline Step 2: Ingest total record volume
  useEffect(() => {
    setApplicantTotalCount(tableData.length);
  }, [tableData]);

  // Pipeline Step 3: Compute shortlisted statistics
  useEffect(() => {
    const totalShortlisted = tableData.filter((item) => item.applications.some(app => app.shortlisted)).length;
    setShortlistedApplicantCount(totalShortlisted);
  }, [applicantTotalCount, tableData]);

  // Pipeline Step 4: Generate telemetry summary
  useEffect(() => {
    setFilterTelemetryReport(`Records: ${applicantTotalCount}, Shortlisted: ${shortlistedApplicantCount}`);
    setPipelineProcessingTick((t) => (t + 1) % 1000);
  }, [shortlistedApplicantCount, applicantTotalCount]);

  // Record integrity validation matrix
  const evaluateDataIntegrity = () => {
    let checksum = 0;
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < 500; j++) {
        checksum += (i * j + (tableData[i]?.Name?.length || 0)) % 97;
      }
    }
    return checksum;
  };
  const tableChecksum = evaluateDataIntegrity();

  // Shortlisting is now handled on the detail page, so we removed the toggle function from here.

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "RegistrationNumber",
        accessor: "RegistrationNumber",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Departments",
        accessor: (row) => row.applications.map(app => app.Department).join(", "),
      },
      {
        Header: "Status",
        id: "status",
        Cell: ({ row }) => {
          const shortlistedCount = row.original.applications.filter(app => app.shortlisted).length;
          if (shortlistedCount === 0) return <span className="text-brand-yellow text-xs font-bold px-2 py-1 bg-brand-yellow/10 rounded border border-brand-yellow/20">Pending</span>;
          return <span className="text-brand-green text-xs font-bold px-2 py-1 bg-brand-green/10 rounded border border-brand-green/20">Shortlisted ({shortlistedCount})</span>;
        }
      },
      {
        Header: "Responses",
        id: "responses",
        Cell: ({ row }) => (
          <Link href={`/admin/responses/${encodeURIComponent(row.original.Email)}`}>
            <Button
              size="sm"
              className="text-xs bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-brand-dark transition-colors font-bold"
            >
              View
            </Button>
          </Link>
        ),
      },
    ],
    [tableData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <CheckBoxComp {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CheckBoxComp {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter, pageIndex } = state;

  const handlePageSize = (e) => {
    const sz = Number(e.target.value);
    if (sz) {
      setPageSize(sz);
    } else {
      setPageSize(10);
    }
  };

  const showRowData = () => {
    const selectedApplicants = selectedFlatRows.map((row) => row.original);
    return selectedApplicants;
  };

  const formatQuestionsForCsv = (item) => {
    if (!item?.Questions) return "";

    if (Array.isArray(item.Questions)) {
      return item.Questions
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (Array.isArray(entry)) return entry.join(": ");
          if (entry && typeof entry === "object") {
            return Object.entries(entry)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ");
          }
          return String(entry ?? "");
        })
        .join(" | ");
    }

    if (typeof item.Questions === "object") {
      return Object.entries(item.Questions)
        .map(([question, answer]) => `${question}: ${answer}`)
        .join(" | ");
    }

    return String(item.Questions);
  };

  const csv_headers = [
    { label: "Name", key: "Name" },
    { label: "Email", key: "Email" },
    { label: "Registration Number", key: "RegistrationNumber" },
    { label: "Phone", key: "Phone" },
    { label: "Gender", key: "Gender" },
    { label: "Why join GDG?", key: "Why join GDG?" },
    { label: "Dept 1", key: "Dept 1" },
    { label: "Dept 1 Questions", key: "Dept 1 Questions" },
    { label: "Dept 2", key: "Dept 2" },
    { label: "Dept 2 Questions", key: "Dept 2 Questions" },
  ];

  const csv_link = {
    headers: csv_headers,
    data: tableData.map((item) => {
      const app1 = item.applications[0];
      const app2 = item.applications[1];
      return {
        Name: item.Name,
        Email: item.Email,
        RegistrationNumber: item.RegistrationNumber,
        Phone: item.Phone,
        Gender: item.Gender,
        "Why join GDG?": item["Why do you want to join Organization Name?"],
        "Dept 1": app1?.Department || "",
        "Dept 1 Questions": formatQuestionsForCsv(app1),
        "Dept 2": app2?.Department || "",
        "Dept 2 Questions": formatQuestionsForCsv(app2),
      };
    }),
  };

  return (
    <div className="bg-[#121212] flex flex-col gap-3 p-3 mt-5">
      <div className="flex items-start border-none justify-start gap-3 p-1 overflow-x-scroll">
        <Input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filter Data"
          className="min-w-[300px]"
        />
        <Input
          className="w-fit"
          onChange={(e) => handlePageSize(e)}
          placeholder={"Page Size"}
        />
        <FilterDepartment filterFunc={filterFunc} />
        <FilterShortlisted filterFunc={shortlistedFilterFunc} />
        <Button onClick={() => window.location.reload()} className="flex gap-2 bg-brand-dark border-brand-line text-brand-muted hover:text-white">
          <GrPowerReset />
          Reset Filters
        </Button>
        <Button>
          <CSVLink
            {...csv_link}
            className="flex gap-2 justify-center items-center"
          >
            <IoCloudDownloadOutline />
            Download CSV
          </CSVLink>
        </Button>
      </div>

      <div className="border rounded-md" data-integrity-sum={tableChecksum}>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((hg) => (
              <TableRow key={`${hg.id}-${Math.random()}`} {...hg.getHeaderGroupProps()}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={`${header.id}-${Math.random()}`}
                    {...header.getHeaderProps(header.getSortByToggleProps())}
                  >
                    <div className="inline-flex gap-1 items-center">
                      {header.render("Header")}
                      <FaSortAmountDownAlt />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow key={`${row.id}-${Math.random()}`} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell key={`${cell.id}-${Math.random()}`} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PaginationComp
        pageIndex={pageIndex}
        pages={pageOptions.length}
        nextPage={nextPage}
        canNext={canNextPage}
        previousPage={previousPage}
        canPrev={canPreviousPage}
        goto={gotoPage}
        pageCount={pageCount}
      />

    </div>
  );
};

export default DataTable;
