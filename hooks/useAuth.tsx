import { getUserLogged } from "@/lib/apis/User";
import { useQuery, useQueryClient } from "@tanstack/react-query";



export const useAuth = ()=>{
    const queryClient = useQueryClient();
    
    
    const { data, isError, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUserLogged,
        staleTime: 1000 * 60 * 5, // 5 minutos sin refetch automático
        gcTime: 1000 * 60 * 10, // Cacheado en memoria por 10 minutos
        retry: 1,
        refetchOnMount: false,   // <- importante
        refetchOnWindowFocus: false,
    });

    const invalidateUser = () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    const clearQuery = ()=>{
        queryClient.clear();
    }
    console.log("usuario",data)
    return {data,isError,isLoading, invalidateUser, clearQuery};
}
