import { useParams, useNavigate } from 'react-router-dom';

const ArtistDetails = () => {
    const {id: artistId} = useParams();
    return (
        <>
            <h1 className="text-2xl">ARTIST PAGE</h1>
            <h1 className="text-2xl">ARTIST ID {artistId}</h1>
        </>
    );
};

export default ArtistDetails;