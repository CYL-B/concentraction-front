/** Organism that tasks several inputs, submit button and dropdown. It includes the logic to add a task and cache it (state management) :
 * with apollo server (GraphQL)  : implement mutation to add a task and cache
 * with react hook form (UI) : handles errors and validation
 */

//context to toggle modal
import { useContext } from "react";
import { ModalContext } from "./modalContext.jsx";

//Input elements
import { Input, TextArea } from "../input/input.jsx";
import { CustomDropdown } from "../input/dropdown.jsx";
import InputDatePicker from "../input/datePicker.jsx";
import { Button } from "../button.jsx";
import { useForm, Controller } from "react-hook-form";

//Apollo client import
import { useMutation } from "@apollo/client";
import { ADD_TASK, GET_USER_TASKS } from "../../services/queries.jsx";

//zod validation import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//"handleSubmit" will validate your inputs before invoking "onSubmit"
//register : register your input into the hook by invoking the "register" function
//include validation with required or other standard HTML validation rules
//errors.nameOfInput : {/* errors will return when field validation fails  */}
//Controller allows us to use react-hook-form with custom components and third party components like customDropdown and datePicker

export function AddATask() {
  const schema = z.object({
    title: z
      .string()
      .min(1, { message: "Required" })
      .max(20, { message: "Too long" }),
    description: z
      .string()
      .max(200, { message: "Message should be less than 200 characters" }),
    deadline: z.coerce.date(),
    startDate: z.coerce.date(),
    status: z.enum(["TODO", "ONGOING", "DONE"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    category: z.enum(["ARTICLES", "PHOTOGRAPHY", "WORK", "PERSONAL", "OTHER"]),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  //consumer component
  const { closeModal, todayTask } = useContext(ModalContext);

  //extracts addTask mutation from useMutation hook, loading, error
  const [addTask] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      //add confirmation message
      console.log("hey", data);
      // closeModal();
    },
    update(cache, { data }) {
      try {
        const existingData = cache.readQuery({
          query: GET_USER_TASKS,
        });

        // Ensure tasks is always an array
        const tasks = existingData?.user?.tasks || [];

        // Modify the cache safely
        cache.writeQuery({
          query: GET_USER_TASKS,
          data: {
            getTasks: {
              ...existingData.getTasks,
              user: {
                ...existingData?.user, // Preserve other user data
                tasks: [data.addTask, ...tasks], // it's always an array
              },
            },
          },
        });
      } catch (error) {
        console.error("Cache update error:", error);
      }
    },
  });

  const formatDateFn = (date) => {
    const selectedDate = new Date(date);
    return selectedDate;
    // return (
    //   selectedDate.getDate() +
    //   "/" +
    //   parseInt(selectedDate.getMonth() + 1) +
    //   "/" +
    //   selectedDate.getFullYear()
    // );
  };

  const onSubmit = async (data) => {
    const startDate = data.startDate;
    const endDate = data.deadline;

    try {
      await addTask({
        variables: {
          content: {
            name: data.title,
            priority: data.priority,
            status: data.status,
            category: data.category,
            startDate: startDate ? formatDateFn(startDate) : null,
            endDate: endDate ? formatDateFn(endDate) : null,
            desc: data.description,
          },
        },
      });
    } catch (error) {
      console.error("Error adding task:", error);

      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err) =>
          console.error("GraphQL Error:", err.message)
        );
      }
    }
  };

  // if (loading) return 'Submitting...';
  // if (error) return `Submission error! ${error.message}`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col justify-around g "
    >
      <div className="input-wrapper flex flex-col items-center bg-neutral-white rounded-md p-2.5 mx-10 border border-solid border-brand-blue gap-2">
        <Input
          placeholder="Titre"
          type="text"
          name="title"
          required
          register={register}
          errors={errors.title}
          ariaInvalid={errors.title ? "true" : "false"}
        />

        <TextArea
          placeholder="Description"
          name="description"
          register={register}
          type="text"
          errors={errors.description}
          ariaInvalid={errors.description ? "true" : "false"}
        />
        <Controller
          control={control}
          name="deadline"
          render={({ field: { onChange, value } }) => (
            <>
              <InputDatePicker
                onChange={onChange}
                value={value}
                errors={errors.deadline}
                dateTitle="Échéance"
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <InputDatePicker
              onChange={onChange}
              value={todayTask?.startDate !== "" ? todayTask?.startDate : value}
              errors={errors.startDate}
              dateTitle="Start date"
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
              options={[
                { name: "TODO" },
                { name: "ONGOING" },
                { name: "DONE" },
              ]}
              onChange={onChange}
              errors={errors.status}
              value={todayTask?.status !== "" ? todayTask?.status : value}
              headerTitle={todayTask?.status !== "" ? todayTask?.status : "Statut"}
            />
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
              options={[{ name: "LOW" }, { name: "MEDIUM" }, { name: "HIGH" }]}
              onChange={onChange}
              value={value}
              errors={errors.priority}
              headerTitle={"Priority"}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
              errors={errors.category}
              options={[
                { name: "ARTICLES" },
                { name: "WORK" },
                { name: "PERSONAL" },
                { name: "PHOTOGRAPHY" },
                { name: "OTHER" },
              ]}
              onChange={onChange}
              value={value}
              headerTitle={"Category"}
            />
          )}
        />
      </div>
      <div className="button-wrapper flex justify-around bg-brand-yellow py-5">
        <Button variant="secondary" onClick={closeModal}>
          Annuler
        </Button>
        <Button role="submit" type="submit">
          Ajouter une tâche
        </Button>
      </div>
    </form>
  );
}
