import React, { useState, useEffect } from "react";
import { Search, Book, Users, Info } from "lucide-react";

interface ApiSectionProps {}

interface Spell {
  index: string;
  name: string;
  desc: string[];
  higher_level?: string[];
  range: string;
  components: string[];
  material?: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  school: {
    name: string;
  };
  classes: {
    name: string;
  }[];
}

interface Class {
  index: string;
  name: string;
  hit_die: number;
  proficiency_choices: any[];
  proficiencies: {
    index: string;
    name: string;
    url: string;
  }[];
  saving_throws: {
    index: string;
    name: string;
    url: string;
  }[];
  starting_equipment: any[];
  class_levels: string;
  subclasses: {
    index: string;
    name: string;
    url: string;
  }[];
  spellcasting?: {
    level: number;
    spellcasting_ability: {
      index: string;
      name: string;
      url: string;
    };
    info: {
      name: string;
      desc: string[];
    }[];
  };
}

const ApiSection: React.FC<ApiSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<"spells" | "classes">("spells");
  const [searchTerm, setSearchTerm] = useState("");
  const [spells, setSpells] = useState<Spell[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedItem, setSelectedItem] = useState<Spell | Class | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch spells list
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://www.dnd5eapi.co/api/spells");
        const data = await response.json();

        // Fetch first 10 spells details
        const spellsPromises = data.results
          .slice(0, 10)
          .map(async (spell: any) => {
            const spellResponse = await fetch(
              `https://www.dnd5eapi.co${spell.url}`
            );
            return await spellResponse.json();
          });

        const spellsData = await Promise.all(spellsPromises);
        setSpells(spellsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch spells");
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  // Fetch classes list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://www.dnd5eapi.co/api/classes");
        const data = await response.json();

        // Fetch all classes details
        const classesPromises = data.results.map(async (cls: any) => {
          const classResponse = await fetch(
            `https://www.dnd5eapi.co${cls.url}`
          );
          return await classResponse.json();
        });

        const classesData = await Promise.all(classesPromises);
        setClasses(classesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch classes");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Search functionality s
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);

      if (activeTab === "spells") {
        const response = await fetch(
          `https://www.dnd5eapi.co/api/spells?name=${searchTerm}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const spellsPromises = data.results.map(async (spell: any) => {
            const spellResponse = await fetch(
              `https://www.dnd5eapi.co${spell.url}`
            );
            return await spellResponse.json();
          });

          const spellsData = await Promise.all(spellsPromises);
          setSpells(spellsData);
        } else {
          setError("No spells found matching your search");
        }
      } else {
        const response = await fetch(
          `https://www.dnd5eapi.co/api/classes?name=${searchTerm}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const classesPromises = data.results.map(async (cls: any) => {
            const classResponse = await fetch(
              `https://www.dnd5eapi.co${cls.url}`
            );
            return await classResponse.json();
          });

          const classesData = await Promise.all(classesPromises);
          setClasses(classesData);
        } else {
          setError("No classes found matching your search");
        }
      }

      setLoading(false);
    } catch (err) {
      setError("Error searching. Please try again.");
      setLoading(false);
    }
  };

  // Handle key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Render spell card
  const renderSpellCard = (spell: Spell) => {
    return (
      <div
        key={spell.index}
        className="api-card bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-700"
        onClick={() => setSelectedItem(spell)}
      >
        <h3 className="text-lg font-bold">{spell.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <span className="px-2 py-1 bg-purple-900 rounded text-xs">
            Level {spell.level}
          </span>
          <span>{spell.school.name}</span>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{spell.desc[0]}</p>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>Casting: {spell.casting_time}</span>
          <span>Range: {spell.range}</span>
        </div>
      </div>
    );
  };

  // Render class card
  const renderClassCard = (cls: Class) => {
    return (
      <div
        key={cls.index}
        className="api-card bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-700"
        onClick={() => setSelectedItem(cls)}
      >
        <h3 className="text-lg font-bold">{cls.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <span className="px-2 py-1 bg-purple-900 rounded text-xs">
            Hit Die: d{cls.hit_die}
          </span>
        </div>
        <p className="mt-2 text-sm">
          Saving Throws: {cls.saving_throws.map((st) => st.name).join(", ")}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          <span>
            Subclasses: {cls.subclasses.map((sc) => sc.name).join(", ")}
          </span>
        </div>
      </div>
    );
  };

  // Render spell details
  const renderSpellDetails = (spell: Spell) => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{spell.name}</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setSelectedItem(null)}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-purple-900 rounded text-xs">
            Level {spell.level}
          </span>
          <span className="px-2 py-1 bg-blue-900 rounded text-xs">
            {spell.school.name}
          </span>
          {spell.ritual && (
            <span className="px-2 py-1 bg-green-900 rounded text-xs">
              Ritual
            </span>
          )}
          {spell.concentration && (
            <span className="px-2 py-1 bg-red-900 rounded text-xs">
              Concentration
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-400">Casting Time</p>
            <p>{spell.casting_time}</p>
          </div>
          <div>
            <p className="text-gray-400">Range</p>
            <p>{spell.range}</p>
          </div>
          <div>
            <p className="text-gray-400">Components</p>
            <p>{spell.components.join(", ")}</p>
          </div>
          <div>
            <p className="text-gray-400">Duration</p>
            <p>{spell.duration}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-400 mb-1">Description</p>
          {spell.desc.map((paragraph, index) => (
            <p key={index} className="mb-2 text-sm">
              {paragraph}
            </p>
          ))}
        </div>

        {spell.higher_level && spell.higher_level.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-400 mb-1">At Higher Levels</p>
            {spell.higher_level.map((paragraph, index) => (
              <p key={index} className="mb-2 text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="text-gray-400 mb-1">Classes</p>
          <div className="flex flex-wrap gap-1">
            {spell.classes.map((cls) => (
              <span
                key={cls.name}
                className="px-2 py-1 bg-gray-700 rounded text-xs"
              >
                {cls.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render class details
  const renderClassDetails = (cls: Class) => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{cls.name}</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setSelectedItem(null)}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-purple-900 rounded text-xs">
            Hit Die: d{cls.hit_die}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-gray-400 mb-1">Saving Throws</p>
          <div className="flex flex-wrap gap-1">
            {cls.saving_throws.map((st) => (
              <span
                key={st.index}
                className="px-2 py-1 bg-gray-700 rounded text-xs"
              >
                {st.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-400 mb-1">Proficiencies</p>
          <div className="flex flex-wrap gap-1">
            {cls.proficiencies.map((prof) => (
              <span
                key={prof.index}
                className="px-2 py-1 bg-gray-700 rounded text-xs"
              >
                {prof.name}
              </span>
            ))}
          </div>
        </div>

        {cls.spellcasting && (
          <div className="mt-4">
            <p className="text-gray-400 mb-1">Spellcasting</p>
            <p className="text-sm">
              Ability: {cls.spellcasting.spellcasting_ability.name}
            </p>
            {cls.spellcasting.info.map((info, index) => (
              <div key={index} className="mt-2">
                <p className="text-sm font-semibold">{info.name}</p>
                {info.desc.map((paragraph, i) => (
                  <p key={i} className="text-xs mt-1">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="text-gray-400 mb-1">Subclasses</p>
          <div className="flex flex-wrap gap-1">
            {cls.subclasses.map((sc) => (
              <span
                key={sc.index}
                className="px-2 py-1 bg-gray-700 rounded text-xs"
              >
                {sc.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-4 mt-4">
      <h2 className="text-2xl font-bold mb-4">D&D 5e Reference</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 rounded-l-lg flex items-center justify-center gap-1 ${
                activeTab === "spells" ? "bg-purple-700" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab("spells")}
            >
              <Book size={16} /> Spells
            </button>
            <button
              className={`flex-1 py-2 rounded-r-lg flex items-center justify-center gap-1 ${
                activeTab === "classes" ? "bg-purple-700" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab("classes")}
            >
              <Users size={16} /> Classes
            </button>
          </div>

          <div className="flex mb-4">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="flex-1 px-3 py-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-r-lg"
              onClick={handleSearch}
            >
              <Search size={16} />
            </button>
          </div>

          {error && (
            <div className="bg-red-900 text-white p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loading text-purple-500">Loading...</div>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTab === "spells" &&
                  spells.map((spell) => (
                    <div
                      key={spell.index}
                      className={`p-2 rounded cursor-pointer ${
                        selectedItem &&
                        "index" in selectedItem &&
                        selectedItem.index === spell.index
                          ? "bg-purple-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedItem(spell)}
                    >
                      <div className="font-medium">{spell.name}</div>
                      <div className="text-xs text-gray-400">
                        Level {spell.level} {spell.school.name}
                      </div>
                    </div>
                  ))}

                {activeTab === "classes" &&
                  classes.map((cls) => (
                    <div
                      key={cls.index}
                      className={`p-2 rounded cursor-pointer ${
                        selectedItem &&
                        "index" in selectedItem &&
                        selectedItem.index === cls.index
                          ? "bg-purple-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedItem(cls)}
                    >
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-xs text-gray-400">
                        Hit Die: d{cls.hit_die}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3">
          {selectedItem ? (
            "level" in selectedItem ? (
              renderSpellDetails(selectedItem as Spell)
            ) : (
              renderClassDetails(selectedItem as Class)
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === "spells" &&
                spells.slice(0, 4).map((spell) => renderSpellCard(spell))}
              {activeTab === "classes" &&
                classes.slice(0, 4).map((cls) => renderClassCard(cls))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiSection;
