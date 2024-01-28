import { useState } from 'react';
import IsoLoading from '../components/IsoLoading';
import Loading from '../components/Loading';

//To use useLoading const {....} = useLoading({...});
export function useLoading({initialValue = false, iso = false, styles}) {
    const [isLoading, setIsLoading] = useState(initialValue);

    const startLoading = () => {
        setIsLoading(true);
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    const loadingComponent = iso ? <IsoLoading style={styles} /> : <Loading style={styles} />;



    return {isLoading, startLoading, stopLoading, loadingComponent};
}