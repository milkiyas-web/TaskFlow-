import Modal from "@/components/Modal";

import React, { useState } from "react";
import { formatISO } from "date-fns";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectContent } from "@radix-ui/react-select";


const contributionType = ["None", "Attend", "Support", "Own"];

const ModalNewTask = ({ isOpen, onClose, id = null }) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [authorUserId, setAuthorUserId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [selectedContributionType, setSelectedContributionType] = useState('');

    const handleSubmit = async () => {
        if (!title || !authorUserId || !(id !== null || projectId)) return;

        const formattedStartDate = formatISO(new Date(startDate), {
            representation: "complete",
        });
        const formattedDueDate = formatISO(new Date(dueDate), {
            representation: "complete",
        });

        // await createTask({
        //   title,
        //   description,
        //   status,
        //   priority,
        //   tags,
        //   startDate: formattedStartDate,
        //   dueDate: formattedDueDate,
        //   authorUserId: parseInt(authorUserId),
        //   assignedUserId: parseInt(assignedUserId),
        //   projectId: id !== null ? Number(id) : Number(projectId),
        // });
    };

    const isFormValid = () => {
        return title && authorUserId && !(id !== null || projectId);
    };

    const selectStyles =
        "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
            <form
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Task"
                    value={title}
                    onChange={(e) => setTask(e.target.value)}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">

                </div>
                <label htmlFor="contributionType">Contribution Type</label>

                <button
                    type="submit"
                    className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid()}
                        }`}
                    disabled={!isFormValid()}
                >
                    {"Create Task"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewTask;