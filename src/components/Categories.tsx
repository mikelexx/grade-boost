import Link from "next/link";
interface Field{
	name: string,
	departments: string[]
}
export default function Categories({fields}: {fields: Field[]}){
	return (
     <>
      <section className="my-12">
        <h2 className=" text-center text-2xl font-semibold mb-6 mx-auto">Browse By Categories</h2>
        <div>
	{fields.map((field) => (
	field.departments.length > 0 &&
            <div key={field.name} className="mb-6">
              <h3 className="text-xl font-bold mb-2">{field.name}</h3>
              <ul className=" flex flex-wrap gap-4 list-none">
                {field.departments.map((dept) => (
                  <li key={dept} className="mb-1">
                    <Link href={`/department/${dept.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-500 hover:underline">
                      {dept}
                    </Link>
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

