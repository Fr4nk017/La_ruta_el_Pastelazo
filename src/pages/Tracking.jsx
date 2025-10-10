
import { useSearchParams } from 'react-router-dom';
export default function Tracking(){
  const [sp] = useSearchParams();
  const id = sp.get('id');
  return <div className="container"><h1 className="h3">Seguimiento</h1>{id? <p>ID: {id}</p>:<p>Sin ID</p>}</div>;
}
