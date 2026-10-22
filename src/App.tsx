import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductList from "./features/products/components/product-list/ProductList.tsx";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductList />
    </QueryClientProvider>
  );
}

export default App;
