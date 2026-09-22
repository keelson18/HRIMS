import { signOut } from "@agent-native/core/client";
import {
  actionErrorMessage,
  useActionMutation,
  useActionQuery,
} from "@agent-native/core/client/hooks";
import {
  IconActivity,
  IconArrowDownRight,
  IconArrowUpRight,
  IconBell,
  IconBriefcase2,
  IconCalendar,
  IconCalendarEvent,
  IconChartBar,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconClock,
  IconDashboard,
  IconDots,
  IconDownload,
  IconFileAnalytics,
  IconFilter,
  IconLayoutDashboard,
  IconLoader2,
  IconLogout,
  IconPencil,
  IconMenu2,
  IconMessage,
  IconPlus,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconTrash,
  IconUserPlus,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { FormEvent, useEffect, useState } from "react";

import { APP_TITLE } from "@/lib/app-config";

const navigation = [
  { label: "Dashboard", icon: IconLayoutDashboard },
  { label: "Employees", icon: IconUsers },
  { label: "Attendance", icon: IconCalendarEvent },
  { label: "Payroll", icon: IconBriefcase2 },
  { label: "Recruitment", icon: IconUserPlus },
  { label: "Leave Management", icon: IconCalendar },
  { label: "Performance", icon: IconChartBar },
  { label: "Reports", icon: IconFileAnalytics },
  { label: "Settings", icon: IconSettings },
];

const activities = [
  {
    name: "Emma Johnson",
    initials: "EJ",
    color: "sky",
    action: "Leave Request",
    detail: "Annual Leave · May 24, 2024",
    time: "10:24 AM",
    by: "Self",
  },
  {
    name: "Liam Smith",
    initials: "LS",
    color: "violet",
    action: "Profile Update",
    detail: "Updated contact information",
    time: "09:48 AM",
    by: "Self",
  },
  {
    name: "Olivia Brown",
    initials: "OB",
    color: "mint",
    action: "Attendance",
    detail: "Checked in at 09:17 AM",
    time: "09:17 AM",
    by: "System",
  },
  {
    name: "Noah Williams",
    initials: "NW",
    color: "amber",
    action: "Document Upload",
    detail: 'Uploaded "ID Proof" document',
    time: "Yesterday",
    by: "Self",
  },
  {
    name: "Ava Davis",
    initials: "AD",
    color: "rose",
    action: "Performance Review",
    detail: "2024 Q2 Review Completed",
    time: "Yesterday",
    by: "Spencer",
  },
];

type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  status: string;
  workType: string;
  joinedDate: string;
};

const chartPoints =
  "0,88 24,79 48,82 72,67 96,70 120,58 144,62 168,47 192,50 216,38 240,43 264,28 288,33";

export function meta() {
  return [
    { title: APP_TITLE },
    {
      name: "description",
      content: "A focused HR operations dashboard for modern teams.",
    },
  ];
}

export default function HomeRoute() {
  const [activeView, setActiveView] = useState("Dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isEmployees = activeView === "Employees";

  return (
    <div className="hrims-app">
      <aside className={`hrims-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">
            <IconUsers size={22} stroke={2.4} />
          </div>
          <div>
            <div className="brand-name">HRIMS</div>
            <div className="brand-caption">
              Human Resource
              <br />
              Information System
            </div>
          </div>
          <button
            className="mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            <IconX size={18} />
          </button>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.label;
            return (
              <button
                className={`nav-item ${active ? "is-active" : ""}`}
                key={item.label}
                onClick={() => {
                  setActiveView(item.label);
                  setMobileNavOpen(false);
                }}
              >
                <Icon size={17} stroke={active ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="secure-icon">
            <IconShieldCheck size={17} />
          </div>
          <div>
            <strong>Your data is secure</strong>
            <span>
              We keep your data safe
              <br />
              and compliant.
            </span>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="hrims-main">
        <header className="topbar">
          <div className="mobile-title-row">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <IconMenu2 size={19} />
            </button>
            <div className="mobile-wordmark">HRIMS</div>
          </div>
          <div className="header-search">
            <IconSearch size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isEmployees
                  ? "Search employees, departments, roles..."
                  : "Search employees, documents, etc..."
              }
              aria-label="Search"
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">
              <IconBell size={18} />
              <span className="notification-dot" />
            </button>
            <button
              className="icon-button message-button"
              aria-label="Messages"
            >
              <IconMessage size={18} />
              <span className="notification-dot" />
            </button>
            <button
              className="icon-button"
              aria-label="Sign out"
              title="Sign out"
              onClick={() => void signOut()}
            >
              <IconLogout size={18} />
            </button>
            <div className="profile-menu">
              <div className="avatar avatar-spencer">S</div>
              <div className="profile-copy">
                <strong>Spencer</strong>
                <span>Admin</span>
              </div>
              <IconChevronDown size={14} />
            </div>
          </div>
        </header>

        <div className="page-wrap">
          {activeView === "Dashboard" && (
            <DashboardView onViewEmployees={() => setActiveView("Employees")} />
          )}
          {isEmployees && <EmployeesView query={search} />}
          {!isEmployees && activeView !== "Dashboard" && (
            <PlaceholderView
              label={activeView}
              onReturn={() => setActiveView("Dashboard")}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  tone,
  inverse,
}: {
  icon: typeof IconUsers;
  label: string;
  value: string;
  change: string;
  tone: string;
  inverse?: boolean;
}) {
  return (
    <div className={`metric-card ${inverse ? "metric-inverse" : ""}`}>
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={change.startsWith("-") ? "negative" : "positive"}>
          {change.startsWith("-") ? (
            <IconArrowDownRight size={12} />
          ) : (
            <IconArrowUpRight size={12} />
          )}
          {change.replace("-", "")} <em>from last month</em>
        </small>
      </div>
    </div>
  );
}

function DashboardView({ onViewEmployees }: { onViewEmployees: () => void }) {
  return (
    <>
      <PageHeading
        eyebrow="Monday, May 20, 2024"
        title="Good morning, Spencer"
        action={
          <button className="primary-button" onClick={onViewEmployees}>
            <IconUsers size={16} /> View employees
          </button>
        }
      />
      <section className="metrics-grid" aria-label="Key metrics">
        <MetricCard
          icon={IconUsers}
          label="Total Employees"
          value="1,248"
          change="5.2%"
          tone="sky"
        />
        <MetricCard
          icon={IconUserPlus}
          label="Present Today"
          value="982"
          change="3.7%"
          tone="mint"
        />
        <MetricCard
          icon={IconCalendarEvent}
          label="Pending Leave Requests"
          value="28"
          change="12.0%"
          tone="amber"
          inverse
        />
        <MetricCard
          icon={IconBriefcase2}
          label="Payroll Due"
          value="$312,450"
          change=""
          tone="violet"
        />
      </section>
      <section className="dashboard-grid">
        <div className="panel chart-panel growth-panel">
          <PanelHeader title="Employee Growth" select="Last 12 Months" />
          <div className="chart-wrap">
            <div className="chart-y-labels">
              <span>1,400</span>
              <span>1,200</span>
              <span>1,000</span>
              <span>800</span>
              <span>600</span>
            </div>
            <svg
              className="growth-chart"
              viewBox="0 0 300 126"
              role="img"
              aria-label="Employee growth rising from 820 to 1,248"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#1976ed" stopOpacity=".18" />
                  <stop offset="1" stopColor="#1976ed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 88 L24 79 L48 82 L72 67 L96 70 L120 58 L144 62 L168 47 L192 50 L216 38 L240 43 L264 28 L288 33 L288 126 L0 126Z"
                fill="url(#chartFill)"
              />
              <path
                d={`M${chartPoints.split(" ").join(" L")}`}
                fill="none"
                stroke="#1976ed"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                [0, 88],
                [24, 79],
                [48, 82],
                [72, 67],
                [96, 70],
                [120, 58],
                [144, 62],
                [168, 47],
                [192, 50],
                [216, 38],
                [240, 43],
                [264, 28],
                [288, 33],
              ].map(([cx, cy], index) => (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r="2.8"
                  fill="white"
                  stroke="#1976ed"
                  strokeWidth="1.8"
                />
              ))}
            </svg>
            <div className="chart-x-labels">
              <span>Jun '23</span>
              <span>Aug '23</span>
              <span>Oct '23</span>
              <span>Dec '23</span>
              <span>Feb '24</span>
              <span>Apr '24</span>
            </div>
          </div>
        </div>
        <div className="panel chart-panel attendance-panel">
          <PanelHeader title="Attendance Trend" select="Last 7 Days" />
          <div className="attendance-hero">
            <strong>92.5%</strong>
            <span>average attendance</span>
          </div>
          <svg
            className="attendance-chart"
            viewBox="0 0 280 120"
            role="img"
            aria-label="Attendance trend over seven days"
          >
            <path
              d="M5 80 L50 52 L96 64 L140 43 L185 55 L230 69 L275 30 L275 120 L5 120Z"
              fill="#e9f4ff"
            />
            <path
              d="M5 80 L50 52 L96 64 L140 43 L185 55 L230 69 L275 30"
              fill="none"
              stroke="#1976ed"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [5, 80],
              [50, 52],
              [96, 64],
              [140, 43],
              [185, 55],
              [230, 69],
              [275, 30],
            ].map(([cx, cy], index) => (
              <g key={index}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill="white"
                  stroke="#1976ed"
                  strokeWidth="1.7"
                />
                <text
                  x={cx}
                  y={cy - 9}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#59677b"
                >
                  {["92%", "94%", "91%", "93%", "90%", "88%", "95%"][index]}
                </text>
              </g>
            ))}
          </svg>
          <div className="chart-x-labels">
            <span>May 14</span>
            <span>May 15</span>
            <span>May 16</span>
            <span>May 17</span>
            <span>May 18</span>
            <span>May 19</span>
            <span>May 20</span>
          </div>
        </div>
      </section>
      <section className="lower-grid">
        <div className="panel activity-panel">
          <PanelHeader
            title="Recent Employee Activity"
            action="View all activity"
          />
          <div className="activity-table">
            <div className="activity-row activity-heading">
              <span>Employee</span>
              <span>Action</span>
              <span>Details</span>
              <span>Time</span>
              <span>By</span>
            </div>
            {activities.map((activity) => (
              <div className="activity-row" key={activity.name}>
                <div className="employee-cell">
                  <div className={`avatar avatar-${activity.color}`}>
                    {activity.initials}
                  </div>
                  <strong>{activity.name}</strong>
                </div>
                <span>
                  <b className={`activity-tag tag-${activity.color}`}>
                    {activity.action}
                  </b>
                </span>
                <span className="activity-detail">{activity.detail}</span>
                <span className="activity-time">{activity.time}</span>
                <span className="activity-by">{activity.by}</span>
              </div>
            ))}
          </div>
          <button className="mobile-link">
            View all activity <IconChevronRight size={14} />
          </button>
        </div>
        <div className="side-stack">
          <div className="panel calendar-panel">
            <PanelHeader title="Calendar" action="May 2024" />
            <div className="calendar-head">
              <button aria-label="Previous month">‹</button>
              <strong>May 2024</strong>
              <button aria-label="Next month">›</button>
            </div>
            <div className="calendar-grid">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
              {[
                "29",
                "30",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
                "13",
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
                "24",
                "25",
                "26",
                "27",
                "28",
                "29",
                "30",
                "31",
                "1",
                "2",
              ].map((day, index) => (
                <span
                  key={index}
                  className={`${day === "20" && index === 21 ? "today" : ""} ${index < 2 || index > 32 ? "muted-day" : ""}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div className="panel events-panel">
            <PanelHeader title="Upcoming Events" action="View all events" />
            <EventRow
              icon={IconBriefcase2}
              color="violet"
              title="Payroll Processing"
              date="May 24, 2024 · 10:00 AM"
            />
            <EventRow
              icon={IconUsers}
              color="mint"
              title="New Employee Orientation"
              date="May 27, 2024 · 09:00 AM"
            />
            <EventRow
              icon={IconChartBar}
              color="amber"
              title="Performance Review Meeting"
              date="May 30, 2024 · 02:00 PM"
            />
            <button className="mobile-link">
              View all events <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

type EmployeeFormData = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "on_leave" | "probation";
  workType: "hybrid" | "remote" | "on-site";
  joinedDate: string;
};

const emptyEmployeeForm: EmployeeFormData = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  role: "",
  status: "active",
  workType: "hybrid",
  joinedDate: "",
};

function EmployeesView({ query }: { query: string }) {
  const [status, setStatus] = useState<
    "all" | "active" | "on_leave" | "probation"
  >("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<EmployeeFormData>(emptyEmployeeForm);
  const pageSize = 10;
  const employeeQuery = useActionQuery("list-employees", {
    query,
    status,
    page,
    pageSize,
  });
  const createEmployee = useActionMutation("create-employee");
  const updateEmployee = useActionMutation("update-employee");
  const deleteEmployee = useActionMutation("delete-employee");
  const rows = (employeeQuery.data?.rows ?? []) as Employee[];
  const total = employeeQuery.data?.total ?? 0;
  const pageCount = employeeQuery.data?.pageCount ?? 1;
  const mutationError =
    createEmployee.error ?? updateEmployee.error ?? deleteEmployee.error;
  const isMutating =
    createEmployee.isPending ||
    updateEmployee.isPending ||
    deleteEmployee.isPending;

  useEffect(() => {
    setPage(1);
  }, [query, status]);

  function openCreateForm() {
    setEditingEmployee(null);
    setForm(emptyEmployeeForm);
    setFormOpen(true);
  }

  function openEditForm(employee: Employee) {
    setEditingEmployee(employee);
    setForm({
      employeeCode: employee.employeeCode,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      status: employee.status as EmployeeFormData["status"],
      workType: employee.workType as EmployeeFormData["workType"],
      joinedDate: employee.joinedDate,
    });
    setFormOpen(true);
  }

  function closeForm() {
    if (isMutating) return;
    setFormOpen(false);
    setEditingEmployee(null);
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingEmployee) {
      updateEmployee.mutate(
        { id: editingEmployee.id, ...form },
        { onSuccess: closeForm },
      );
      return;
    }
    createEmployee.mutate(form, { onSuccess: closeForm });
  }

  function confirmDelete(id: string) {
    deleteEmployee.mutate(
      { id },
      { onSuccess: () => setPendingDeleteId(null) },
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="People operations"
        title="Employees"
        action={
          <button className="primary-button" onClick={openCreateForm}>
            <IconPlus size={16} /> Add employee
          </button>
        }
      />
      <section className="metrics-grid" aria-label="Employee totals">
        <MetricCard
          icon={IconUsers}
          label="Employees in view"
          value={String(total)}
          change=""
          tone="sky"
        />
        <MetricCard
          icon={IconUserPlus}
          label="Current page"
          value={`${rows.length} / ${pageSize}`}
          change=""
          tone="mint"
        />
        <MetricCard
          icon={IconCalendarEvent}
          label="Page"
          value={`${page} / ${pageCount}`}
          change=""
          tone="amber"
          inverse
        />
        <MetricCard
          icon={IconActivity}
          label="Data source"
          value="Live"
          change=""
          tone="violet"
        />
      </section>
      {formOpen && (
        <EmployeeForm
          editing={Boolean(editingEmployee)}
          value={form}
          pending={isMutating}
          error={mutationError}
          onChange={setForm}
          onSubmit={submitForm}
          onCancel={closeForm}
        />
      )}
      <section className="employees-layout">
        <div className="panel employee-list-panel">
          <div className="list-toolbar">
            <div
              className="segmented"
              role="tablist"
              aria-label="Employee status"
            >
              <button
                className={status === "all" ? "selected" : ""}
                onClick={() => setStatus("all")}
                role="tab"
                aria-selected={status === "all"}
              >
                All Employees <span>{total}</span>
              </button>
              <button
                className={status === "active" ? "selected" : ""}
                onClick={() => setStatus("active")}
                role="tab"
                aria-selected={status === "active"}
              >
                Active
              </button>
              <button
                className={status === "on_leave" ? "selected" : ""}
                onClick={() => setStatus("on_leave")}
                role="tab"
                aria-selected={status === "on_leave"}
              >
                On Leave
              </button>
              <button
                className={status === "probation" ? "selected" : ""}
                onClick={() => setStatus("probation")}
                role="tab"
                aria-selected={status === "probation"}
              >
                Probation
              </button>
            </div>
            <div className="toolbar-actions">
              <span className="live-query-label">
                <IconFilter size={13} /> Server filtered
              </span>
              <button
                className="icon-button"
                aria-label="Refresh employees"
                onClick={() => void employeeQuery.refetch()}
              >
                <IconDownload size={16} />
              </button>
            </div>
          </div>
          {employeeQuery.isLoading ? (
            <div className="table-state" role="status">
              <IconLoader2 className="spin" size={20} />
              <span>Loading employees</span>
            </div>
          ) : employeeQuery.error ? (
            <div className="table-state table-error" role="alert">
              <strong>Employees could not be loaded.</strong>
              <span>
                {readableActionError(
                  employeeQuery.error,
                  "Try again in a moment.",
                )}
              </span>
              <button
                className="secondary-button"
                onClick={() => void employeeQuery.refetch()}
              >
                Retry
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="table-state">
              <IconUsers size={24} />
              <strong>No employees match this view.</strong>
              <span>Adjust the search or add the first employee.</span>
              <button className="secondary-button" onClick={openCreateForm}>
                Add employee
              </button>
            </div>
          ) : (
            <div className="employee-table">
              <div className="employee-table-row employee-table-header">
                <span>Employee</span>
                <span>Employee ID</span>
                <span>Department</span>
                <span>Role</span>
                <span>Status</span>
                <span>Work Type</span>
                <span>Joining Date</span>
                <span>Actions</span>
              </div>
              {rows.map((employee) => {
                const name = `${employee.firstName} ${employee.lastName}`;
                return (
                  <div className="employee-table-row" key={employee.id}>
                    <div className="employee-cell">
                      <div className={`avatar avatar-${avatarTone(name)}`}>
                        {initials(name)}
                      </div>
                      <div>
                        <strong>{name}</strong>
                        <small className="employee-email">
                          {employee.email}
                        </small>
                      </div>
                    </div>
                    <span className="muted-text">{employee.employeeCode}</span>
                    <span className="dept-text">{employee.department}</span>
                    <span>{employee.role}</span>
                    <span>
                      <b
                        className={`status-pill status-${employee.status.replace("_", "-")}`}
                      >
                        {employee.status.replace("_", " ")}
                      </b>
                    </span>
                    <span>
                      <b
                        className={`type-pill type-${employee.workType.replace("-", "")}`}
                      >
                        {employee.workType}
                      </b>
                    </span>
                    <span>{formatJoinedDate(employee.joinedDate)}</span>
                    <span className="row-actions">
                      <button
                        aria-label={`Edit ${name}`}
                        onClick={() => openEditForm(employee)}
                      >
                        <IconPencil size={14} />
                      </button>
                      <button
                        aria-label={`Delete ${name}`}
                        onClick={() => setPendingDeleteId(employee.id)}
                      >
                        <IconTrash size={14} />
                      </button>
                    </span>
                    {pendingDeleteId === employee.id && (
                      <div className="delete-confirm" role="alert">
                        <span>Delete {name}?</span>
                        <button
                          onClick={() => confirmDelete(employee.id)}
                          disabled={isMutating}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(null)}
                          disabled={isMutating}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="list-footer">
            <span>
              Showing {rows.length ? (page - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(page * pageSize, total)} of {total} employees
            </span>
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                ‹
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                disabled={page >= pageCount}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
              >
                ›
              </button>
            </div>
            <span className="per-page">{pageSize} / page</span>
          </div>
        </div>
        <div className="panel distribution-panel">
          <PanelHeader title="Employee data" />
          <div className="data-health">
            <IconCircleCheck size={24} />
            <strong>Live database</strong>
            <span>Records are scoped to the signed-in workspace.</span>
          </div>
          <div className="distribution-list">
            <span>
              <i className="dot dot-blue" />
              Search <b>{query ? "Active" : "Ready"}</b>
            </span>
            <span>
              <i className="dot dot-mint" />
              Filter <b>{status.replace("_", " ")}</b>
            </span>
            <span>
              <i className="dot dot-purple" />
              Pagination <b>{pageSize} rows</b>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function EmployeeForm({
  editing,
  value,
  pending,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  editing: boolean;
  value: EmployeeFormData;
  pending: boolean;
  error: unknown;
  onChange: (value: EmployeeFormData) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  function updateField<K extends keyof EmployeeFormData>(
    field: K,
    fieldValue: EmployeeFormData[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }
  return (
    <section
      className="panel employee-form-panel"
      aria-labelledby="employee-form-title"
    >
      <div className="panel-header">
        <h2 id="employee-form-title">
          {editing ? "Edit employee" : "Add employee"}
        </h2>
        <button
          className="icon-button"
          onClick={onCancel}
          aria-label="Close form"
        >
          <IconX size={16} />
        </button>
      </div>
      <form className="employee-form" onSubmit={onSubmit}>
        <label>
          Employee ID
          <input
            required
            maxLength={32}
            value={value.employeeCode}
            onChange={(event) =>
              updateField("employeeCode", event.target.value)
            }
          />
        </label>
        <label>
          First name
          <input
            required
            maxLength={80}
            value={value.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
        </label>
        <label>
          Last name
          <input
            required
            maxLength={80}
            value={value.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
        </label>
        <label>
          Work email
          <input
            required
            type="email"
            maxLength={254}
            value={value.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label>
          Department
          <input
            required
            maxLength={100}
            value={value.department}
            onChange={(event) => updateField("department", event.target.value)}
          />
        </label>
        <label>
          Role
          <input
            required
            maxLength={120}
            value={value.role}
            onChange={(event) => updateField("role", event.target.value)}
          />
        </label>
        <label>
          Status
          <select
            value={value.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as EmployeeFormData["status"],
              )
            }
          >
            <option value="active">Active</option>
            <option value="on_leave">On leave</option>
            <option value="probation">Probation</option>
          </select>
        </label>
        <label>
          Work type
          <select
            value={value.workType}
            onChange={(event) =>
              updateField(
                "workType",
                event.target.value as EmployeeFormData["workType"],
              )
            }
          >
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
            <option value="on-site">On-site</option>
          </select>
        </label>
        <label>
          Joining date
          <input
            required
            type="date"
            value={value.joinedDate}
            onChange={(event) => updateField("joinedDate", event.target.value)}
          />
        </label>
        <div className="employee-form-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={pending}>
            {pending && <IconLoader2 className="spin" size={14} />}
            {editing ? "Save changes" : "Add employee"}
          </button>
        </div>
        {error ? (
          <p className="form-error" role="alert">
            {readableActionError(error, "The employee could not be saved.")}
          </p>
        ) : null}
      </form>
    </section>
  );
}

function readableActionError(error: unknown, fallback: string): string {
  const message: unknown = actionErrorMessage(error);
  return typeof message === "string" ? message : fallback;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarTone(name: string) {
  const tones = ["sky", "violet", "mint", "amber", "rose", "blue", "teal"];
  return tones[name.length % tones.length];
}

function formatJoinedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function PlaceholderView({
  label,
  onReturn,
}: {
  label: string;
  onReturn: () => void;
}) {
  return (
    <div className="placeholder-screen">
      <div className="placeholder-icon">
        <IconActivity size={28} />
      </div>
      <h1>{label}</h1>
      <p>This module is ready for the next build pass.</p>
      <button className="primary-button" onClick={onReturn}>
        Return to dashboard <IconChevronRight size={16} />
      </button>
    </div>
  );
}

function PanelHeader({
  title,
  select,
  action,
}: {
  title: string;
  select?: string;
  action?: string;
}) {
  return (
    <div className="panel-header">
      <h2>
        {title}
        <span className="info-dot">i</span>
      </h2>
      {select && (
        <button className="panel-select">
          {select}
          <IconChevronDown size={13} />
        </button>
      )}
      {action && (
        <button className="panel-link">
          {action} <IconChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

function EventRow({
  icon: Icon,
  color,
  title,
  date,
}: {
  icon: typeof IconUsers;
  color: string;
  title: string;
  date: string;
}) {
  return (
    <div className="event-row">
      <div className={`event-icon ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <strong>{title}</strong>
        <span>{date}</span>
      </div>
    </div>
  );
}
