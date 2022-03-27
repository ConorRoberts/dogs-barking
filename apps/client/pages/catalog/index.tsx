import MetaData from "@components/MetaData";
import { FormEvent, useEffect, useState } from "react";
import CatalogFilter from "@components/CatalogFilter";
import getNodeCounts from "@utils/getNodeCounts";
import Link from "next/link";
import axios from "axios";
import PageIndex from "@components/PageIndex";
import { LoadingIcon } from "@components/Icons";
import { CatalogState } from "@redux/catalog";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

interface PageProps {
  counts: {
    courses: number;
    programs: number;
  };
}

const Page = ({ counts }: PageProps) => {
  const { filters, pageState, type, scope } = useSelector<RootState, CatalogState>((state) => state.catalog);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      if (type === "courses") {
        const res = await axios.get("/api/course/query", { params: { ...filters, ...pageState, scope } });
        setData(res.data);
      } else if (type === "programs") {
        const res = await axios.get("/api/program");
        setData(res.data);
      }
    } catch (error) {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSubmit();
  }, [pageState.pageNum, type]);
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-6xl w-full">
      <MetaData title="Catalog" />
      <div className="text-center mb-8">
        <h1>Catalog</h1>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex justify-center my-2">
            <PageIndex {...counts} />
          </div>
          <div>
            {loading && <LoadingIcon size={45} className="animate-spin text-gray-500" />}
            {!loading && (
              <ul
                className="divide-slate-200 dark:divide-slate-600 divide-y overflow-y-scroll h-screen box-content scrollbar
                      scrollbar-track-y-transparent">
                {data.length === 0 ? (
                  <p className="text-center">Nothing found</p>
                ) : (
                  data?.map((e) => (
                    <div
                      className="py-2 hover:bg-sky-200 even:bg-gray-200 dark:hover:bg-gray-700 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:opacity-90 cursor-pointer transition"
                      key={e.id}>
                      {
                        <li>
                          <Link href={`/${type === "courses" ? "course" : "programs"}/${e.nodeId}`}>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{e.id}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {e.name} {type === "courses" && `- [${e?.weight?.toFixed(2)}]`}
                              </p>
                              {type === "programs" && (
                                <>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{e.school}</p>
                                </>
                              )}
                            </div>
                          </Link>
                        </li>
                      }
                    </div>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
        <CatalogFilter handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const counts = await getNodeCounts();

  return {
    props: { counts },
  };
};

export default Page;
