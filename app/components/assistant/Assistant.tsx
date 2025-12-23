"use client";

import AvatarRenderer from "./AvatarRenderer";
import { useAvatarController } from "./AvatarController";

export default function Assistant({
  activeTab,
  searchText,
}: {
  activeTab: string;
  searchText: string;
}) {
  const { state } = useAvatarController(activeTab, searchText);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AvatarRenderer state={state} />
    </div>
  );
}
