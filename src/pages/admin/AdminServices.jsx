import { useEffect, useState } from "react";

export default function AdminServices() {
  const [sites, setSites] = useState([]);
  const [staff, setStaff] = useState([]);

  /* ======================
     API PLACEHOLDERS
     ====================== */
  useEffect(() => {
    // TODO: GET /admin/sites
    setSites([
      { id: 1, name: "XL CP", staffCount: 3 },
      { id: 2, name: "XL Gurgaon", staffCount: 2 },
    ]);

    // TODO: GET /admin/staff
    setStaff([
      { id: 1, name: "Rahul", site: "XL CP" },
      { id: 2, name: "Amit", site: "XL Gurgaon" },
    ]);
  }, []);

  return (
    <div className="px-5 pt-6 space-y-8 max-w-md mx-auto">

      <h1 className="text-2xl font-semibold text-text">
        Services
      </h1>

      {/* Sites */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-text">
            Sites
          </h2>
          <button className="text-sm text-primary">
            + Add Site
          </button>
        </div>

        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-xl p-4 shadow-soft"
          >
            <p className="text-sm font-medium text-text">
              {site.name}
            </p>
            <p className="text-xs text-muted">
              {site.staffCount} staff assigned
            </p>
          </div>
        ))}
      </section>

      {/* Staff */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-text">
            Staff
          </h2>
          <button className="text-sm text-primary">
            + Add Staff
          </button>
        </div>

        {staff.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl p-4 shadow-soft flex justify-between"
          >
            <div>
              <p className="text-sm font-medium text-text">
                {s.name}
              </p>
              <p className="text-xs text-muted">
                Assigned to {s.site}
              </p>
            </div>

            <button className="text-xs text-red-500">
              Remove
            </button>
          </div>
        ))}
      </section>

    </div>
  );
}
