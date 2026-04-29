import { useParams } from 'react-router-dom';
import ProductsPage from './ProductsPage';

export default function ProductPageWrapper() {
    const { category } = useParams<{ category: string }>();
    return <ProductsPage category={category || 'all'} />;
}
