import Requirement from "~/types/Requirement";
import RequirementCard from "./RequirementCard";

interface Props {
  requirements: Requirement[];
}

const RequirementsList = ({ requirements }: Props) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {requirements.map((e, index) => (
        <RequirementCard requirement={e} key={`requirement-list-${index}`} />
      ))}
    </div>
  );
};

// interface SubrequirementProps {
//   parent: Requirement;
//   type: string;
// }
// const SubrequirementsList = ({ parent }: SubrequirementProps) => {
//   return (
//     <div className="px-8">
//       {parent.requirements.map((requirement, index) => (
//         <div key={index} className="flex flex-col">
//           <p>{requirement.label === "Course" && (requirement as Course).code}</p>
//           <p>
//             {requirement.label === "OrBlock" &&
//               `Choose ${
//                 (requirement as OrBlockData).type === "credit"
//                   ? `${Number((requirement as OrBlockData).target).toFixed(2)} Credits`
//                   : `${Number((requirement as OrBlockData).target).toFixed(0)}`
//               }`}
//           </p>
//           <SubrequirementsList parent={requirement} type={requirement.label} />
//         </div>
//       ))}
//     </div>
//   );
// };

export default RequirementsList;
