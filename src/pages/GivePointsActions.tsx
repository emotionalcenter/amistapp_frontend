import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface ActionRow {
  id: string;
  name: string;
  description: string | null;
  points: number;
}

export default function GivePointsActions() {
  const navigate = useNavigate();

  const [actions, setActions] = useState<ActionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActions() {
      const { data } = await supabase
        .from("actions_catalog")
        .select("*")
        .order("points", { ascending: false });

      setActions(data || []);
      setLoading(false);
    }

    loadActions();
  }, []);

  function selectAction(action: ActionRow) {
    navigate("/teacher/give-points/students", {
      state: { selectedAction: action },
    });
  }

  if (loading) return <p className="p-5">Cargando acciones...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Selecciona una acción positiva
      </h1>

      {actions.map((action) => (
        <div
          key={action.id}
          onClick={() => selectAction(action)}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-purple-100 transition"
        >
          <p className="font-bold">{action.name}</p>
          <p className="text-sm text-gray-600">{action.description}</p>
          <p className="text-purple-600 font-bold mt-2">
            +{action.points} puntos
          </p>
        </div>
      ))}
    </div>
  );
}
