import Link from "next/link";
import { useRouter } from 'next/navigation'; // Use next/navigation for client components

interface Field {
  name: string;
  departments: string[];
}

export default function Categories({ fields }: { fields: Field[] }) {
  const router = useRouter();

  const handleCategoryClick = (dept: string) => {
    // Navigate to the results page with the department as a query parameter
    router.push(`/results?category=${encodeURIComponent(dept)}`);
  };

  return (
    <>
      <section className="my-12">
        <h2 className="text-center text-2xl font-semibold mb-6 mx-auto">Browse By Categories</h2>
        <div>
          {fields.map((field) => (
            field.departments.length > 0 &&
            <div key={field.name} className="mb-6">
              <h3 className="text-xl font-bold mb-2">{field.name}</h3>
              <ul className="flex flex-wrap gap-4 list-none">
                {field.departments.map((dept) => (
                  <li key={dept} className="mb-1">
                    <button
                      onClick={() => handleCategoryClick(dept)}
                      className="text-blue-500 hover:underline"
                    >
                      {dept}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

