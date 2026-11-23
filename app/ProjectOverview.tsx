import type {ReactNode} from 'react';
import './project-overview.css';
export default function ProjectOverview({id,description,year,project,roles,labels=['OVERVIEW','YEAR','PROJECT','MY ROLE']}:{id?:string;description:ReactNode;year:string;project:ReactNode;roles:string[];labels?:string[]}){
 return <section id={id} className="project-overview" aria-label={labels[0]}><div className="project-overview-copy"><h2>{labels[0]}</h2>{description}</div><div className="project-overview-meta"><div><h2>{labels[1]}</h2><p>{year}</p></div><div><h2>{labels[2]}</h2><p>{project}</p></div><div><h2>{labels[3]}</h2><ul>{roles.map(role=><li key={role}>{role}</li>)}</ul></div></div></section>;
}
