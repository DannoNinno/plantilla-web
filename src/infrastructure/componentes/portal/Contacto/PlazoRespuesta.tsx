import {getSitio} from '../../../handlers/datos';

export default function PlazoRespuesta({className}: {className?: string}) {
  return <p className={className}>{getSitio().plazoRespuesta}</p>;
}
