import { MdSunny, MdNightlight } from "react-icons/md";
import Toggle from "../toggle";
import { useTheme } from "~/hooks";

export default function ThemeSwitcher({
  preferredTheme,
}: {
  preferredTheme?: string;
}) {
  const [theme, setTheme] = useTheme(preferredTheme);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    const formData = new FormData();
    formData.append("theme", newTheme);
    await fetch("/theme/set", { method: "POST", body: formData });
    setTheme(newTheme);
  };

  return (
    <Toggle
      iconEnabled={MdSunny}
      iconDisabled={MdNightlight}
      checked={theme === "light"}
      onChange={toggleTheme}
    />
  );
}
