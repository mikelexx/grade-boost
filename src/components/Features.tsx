import Image from "next/image";
export default function Features() {
  return (
  <section id='features' >
      <h2 className=" text-center text-2xl font-semibold mb-6 mx-auto">Features</h2>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 p-8">
      <div className="flex flex-col items-center text-center bg-white rounded-lg  p-6">
        <Image
          src="/images/icons8-download-100.png"
          width={100}
          height={100}
          alt="download feature image"
          className="rounded-full mb-4"
        />
        <h3 className="font-semibold text-lg mb-2">Download</h3>
        <p className="text-gray-600">
          Users can download study materials like past papers, notes, and assignments directly to their devices. Each user is allowed to upload one material, and in return, they can download up to five different materials, ensuring a fair exchange of resources.
        </p>
      </div>

      <div className="flex flex-col items-center text-center bg-white rounded-lg  p-6">
        <Image
          src="/images/icons8-save-100.png"
          width={100}
          height={100}
          alt="save feature image"
          className="rounded-full mb-4"
        />
        <h3 className="font-semibold text-lg mb-2">Save</h3>
        <p className="text-gray-600">
          The Save feature allows users to bookmark or save materials to their account for later access. This is especially helpful when users want to keep certain materials handy without needing to download them immediately.
        </p>
      </div>

      <div className="flex flex-col items-center text-center bg-white rounded-lg  p-6 ">
        <Image
          src="/images/icons8-open-file-100.png"
          width={100}
          height={100}
          alt="open feature image"
          className="rounded-full mb-4"
        />
        <h3 className="font-semibold text-lg mb-2">Open</h3>
        <p className="text-gray-600">
          The Open feature enables users to view the study materials directly within the browser without downloading them. This option is perfect for quick reviews or accessing files on the go.
        </p>
      </div>
    </div>
    </section>
  );
}

