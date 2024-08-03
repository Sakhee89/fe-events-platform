import React, { useState } from "react";
import Button from "./Button";
import { deleteEvent } from "../../utils/backendApiUtils";

interface DeleteEventButtonProps {
  eventId: string;
  userToken: string;
  onDeleteSuccess: () => void;
}

const DeleteEventButton: React.FC<DeleteEventButtonProps> = ({
  eventId,
  userToken,
  onDeleteSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setLoading(true);

    try {
      await deleteEvent(eventId, userToken);
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-red-600 hover:bg-red-400 max-w-xl"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
};

export default DeleteEventButton;
