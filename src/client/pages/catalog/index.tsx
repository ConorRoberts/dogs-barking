import MetaData from "@components/MetaData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import CatalogFilter from "@components/CatalogFilter";
import Link from "next/link";
import axios from "axios";
import PageIndex from "@components/PageIndex";
import { LoadingIcon } from "@components/Icons";
import { CatalogState } from "@redux/catalog";
import { RootState } from "@redux/store";
import { Provider, useSelector } from "react-redux";
import catalogStore from "@redux/catalog";

interface PageProps {
  counts: {
    courses: number;
    programs: number;
  };
}

const Page = () => {
  const { filters, pageState, type, scope } = useSelector<CatalogState, CatalogState>((state) => state);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      setLoading(true);

      try {
        const res = await axios.get("/api/course", { params: { ...filters, ...pageState, scope } });
        // Set total number of nodes returned instead of all nodes in the database
        if (res.data.length > 0) {
          setTotal(res.data[0].total);
        } else {
          setTotal(0);
        }
        setData(res.data);
      } catch (error) {
        setData([]);
      }
      setLoading(false);
    },
    [filters, pageState, scope]
  );

  useEffect(() => {
    handleSubmit();
  }, [type, handleSubmit]);

  return (
    <div className="flex flex-col gap-4 mx-auto max-w-6xl w-full">
      <MetaData title="Catalog" />
      <div className="text-center mb-8">
        <h1>Catalog</h1>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          {/* <div className="flex justify-center my-2">
            <PageIndex totalEntries={total} />
          </div> */}
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
                          <Link href={`/${type === "courses" ? "course" : "program"}/${e.id}`} passHref>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {type === "courses" ? e.code : e.short}
                              </p>
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
        {/* <CatalogFilter handleSubmit={handleSubmit} /> */}
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: { counts: { courses: 0, programs: 0 } },
  };
};

const WrappedPage = (props) => {
  return (
    <Provider store={catalogStore}>
      <Page {...props} />
    </Provider>
  );
};

export default WrappedPage;
