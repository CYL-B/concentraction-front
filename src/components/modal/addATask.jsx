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

//"handleSubmit" will validate your inputs before invoking "onSubmit"
//register : register your input into the hook by invoking the "register" function
//include validation with required or other standard HTML validation rules
//errors.nameOfInput : {/* errors will return when field validation fails  */}
//Controller allows us to use react-hook-form with custom components and third party components like customDropdown and datePicker

export function AddATask() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  //consumer component
  const { closeModal } = useContext(ModalContext);

  //extracts addTask mutation from useMutation hook, loading, error
  const [addTask, {data, loading, error }] = useMutation(ADD_TASK, {
    onCompleted: (data) => {
      //add confirmation message
      console.log("hey",data);
    },
    // update(cache, { data }) {
    //   //current state of tasks
    //   const { tasks } = cache.readQuery({
    //     query: GET_USER_TASKS,
    //   });
    //   //change the data within the cache for get user tasks, copying current tasks and adding the new one
    //   cache.writeQuery({
    //     query: GET_USER_TASKS,
    //     data: {
    //       user: {
    //         tasks: [data.addTask, ...tasks],
    //       },
    //     },
    //   });
    // },
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

  const onSubmit = (data) => {
    const startDate = data.StartDate;
    const endDate = data.echeance;
   
    try {
      addTask({
        variables: {
          content: {
            name: data.titre,
            priority: data.priority,
            status: data.statut,
            category: data.category,
            startDate: startDate ? formatDateFn(startDate) : null,
            endDate: endDate ? formatDateFn(endDate) : null,
            desc: data.description,
          },
        },
      });
      console.log("pass");
    } catch (res) {
      const errors = res.graphQLErrors.map((error) => {
        return error.message;
      });
    }
  };

  // if (loading) return 'Submitting...';
  // if (error) return `Submission error! ${error.message}`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col justify-around  "
    >
      <div className="input-wrapper bg-neutral-white rounded-md p-2.5 mx-10 border border-solid border-brand-blue">
        <Input
          type="text"
          name="titre"
          register={register}
          aria-invalid={errors.example1 ? "true" : "false"}
        />

        <TextArea name="description" register={register} />
        <Controller
          control={control}
          name="echeance"
          
          render={({ field: { onChange, value } }) => (
            <InputDatePicker onChange={onChange} value={value} dateTitle="Deadline" />
          )}
        />

        <Controller
          control={control}
          name="StartDate"
          render={({ field: { onChange, value } }) => (
            <InputDatePicker onChange={onChange} value={value} dateTitle="Start date"/>
          )}
        />


        <Controller
          control={control}
          name="statut"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
              options={[
                { name: "TODO" },
                { name: "ONGOING" },
                { name: "DONE" },
              ]}
              onChange={onChange}
              value={value}
              headerTitle={"Statut"}
            />
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
              options={[
                { name: "LOW" },
                { name: "MEDIUM" },
                { name: "HIGH" },
              ]}
              onChange={onChange}
              value={value}
              headerTitle={"Priority"}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <CustomDropdown
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
