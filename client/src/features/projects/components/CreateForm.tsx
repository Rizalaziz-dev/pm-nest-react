import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Input from "../../../components/ui/Input";
// Make sure to import your schema and the arrays for the dropdowns
import { 
    createProjectScheme, 
    CreateProjectFormData, 
    PROJECT_SCOPES, 
    PROJECT_TYPES 
} from "../schemas/project.schemas";

interface Props {
    onSubmit: (data: CreateProjectFormData) => void;
    initialData?: CreateProjectFormData | null;
}

export default function CreateProjectForm({ onSubmit, initialData }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectScheme),
        defaultValues: initialData || {
            plotting: "REGULAR",
            scope: "NEW_ASSY",
            breakdownDays: 5,
            totalPo: 0, 
            orderDate: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form 
            id="create-project-form" 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-4"
        >
            <h3 className="text-lg font-bold">Project Details</h3>
            
            <Input
                label="Assy Number"
                type="text"
                placeholder="e.g. 821-4402-AB"
                {...register("assyNumber")}
                error={errors.assyNumber?.message}
            />

            <Input
                label="Customer"
                type="text"
                placeholder="e.g. Toyota"
                {...register("customer")}
                error={errors.customer?.message}
            />

            <Input
                label="Total PO"
                type="number"
                placeholder="e.g. 998811"
                {...register("totalPo", { valueAsNumber: true })}
                error={errors.totalPo?.message}
            />

            {/* --- DROPDOWNS --- */}
            <div className="grid grid-cols-2 gap-4">
                <fieldset className="fieldset w-full px-0">
                    <legend className="fieldset-legend text-base-content">
                        Plotting Type
                    </legend>
                    <select 
                        className={`select select-bordered w-full ${errors.plotting ? 'select-error' : ''}`}
                        {...register("plotting")}
                    >
                        {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.plotting && <span className="text-xs text-error">{errors.plotting.message}</span>}
                </fieldset>

                <fieldset className="fieldset w-full px-0">
                    <legend className="fieldset-legend text-base-content">
                        Project Scope
                    </legend>
                    <select 
                        className={`select select-bordered w-full ${errors.scope ? 'select-error' : ''}`}
                        {...register("scope")}
                    >
                        {PROJECT_SCOPES.map((scope) => (
                            <option key={scope} value={scope}>
                                {scope.replace(/_/g, " ")} {/* Makes "NEW_ASSY" look like "NEW ASSY" */}
                            </option>
                        ))}
                    </select>
                    {errors.scope && <span className="text-xs text-error">{errors.scope.message}</span>}
                </fieldset>
            </div>

            {/* --- TIMELINE --- */}
            <Input
                label="Breakdown Duration (Days)"
                type="number"
                {...register("breakdownDays", { valueAsNumber: true })}
                error={errors.breakdownDays?.message}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Order Date"
                    type="date"
                    {...register("orderDate")}
                    error={errors.orderDate?.message}
                />
                <Input
                    label="ETD (Deadline)"
                    type="date"
                    {...register("etd")}
                    error={errors.etd?.message}
                />
            </div>

            
        </form>
    );
}