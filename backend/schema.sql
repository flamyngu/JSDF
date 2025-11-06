-- schema.sql
-- Zuerst alle Tabellen löschen falls sie existieren
DROP TABLE IF EXISTS Personnel;
DROP TABLE IF EXISTS Unit;
DROP TABLE IF EXISTS Branch;

CREATE TABLE Branch (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE Unit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    parent_unit_id INTEGER,
    branch_id INTEGER NOT NULL,
    FOREIGN KEY (parent_unit_id) REFERENCES Unit(id),
    FOREIGN KEY (branch_id) REFERENCES Branch(id)
);

CREATE TABLE Personnel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rank TEXT,
    position TEXT,
    unit_id INTEGER NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES Unit(id)
);

-- Branches einfügen
INSERT INTO Branch (name, description) VALUES
('Japan Ground Self-Defense Force', 'Landstreitkräfte der JSDF'),
('Japan Maritime Self-Defense Force', 'Seestreitkräfte der JSDF'),
('Japan Air Self-Defense Force', 'Luftstreitkräfte der JSDF');

-- Units – Ground (branch_id = 1)
INSERT INTO Unit (name, type, parent_unit_id, branch_id) VALUES
('Ground Component Command', 'Command', NULL, 1),              -- id: 1
('Central Readiness Force', 'Command', 1, 1),                  -- id: 2
('1st Division', 'Division', 2, 1),                            -- id: 3
('2nd Division', 'Division', 2, 1),                            -- id: 4
('1st Airborne Brigade', 'Brigade', 2, 1);                     -- id: 5

-- Units – Maritime (branch_id = 2)
INSERT INTO Unit (name, type, parent_unit_id, branch_id) VALUES
('Maritime Component Command', 'Command', NULL, 2),            -- id: 6
('Fleet Headquarters', 'Command', 6, 2),                       -- id: 7
('Self-Defense Fleet', 'Fleet Command', 7, 2),                 -- id: 8
('Escort Flotilla One', 'Flotilla', 8, 2),                     -- id: 9
('Submarine Squadron Two', 'Squadron', 8, 2);                  -- id: 10

-- Units – Air (branch_id = 3)
INSERT INTO Unit (name, type, parent_unit_id, branch_id) VALUES
('Air Component Command', 'Command', NULL, 3),                 -- id: 11
('Air Defense Command', 'Command', 11, 3),                     -- id: 12
('Air Training Command', 'Command', 11, 3),                    -- id: 13
('1st Air Wing', 'Wing', 12, 3),                               -- id: 14
('2nd Air Wing', 'Wing', 12, 3);                               -- id: 15

-- Personnel (mit korrigierten unit_ids)
INSERT INTO Personnel (name, rank, position, unit_id) VALUES
('General Yoshida', 'General', 'Chief of Staff, Ground Self-Defense Force', 2),
('Lt. General Sato', 'Lt. General', '1st Division Commander', 3),
('Lt. General Tanaka', 'Lt. General', '2nd Division Commander', 4),
('Brigadier General Suzuki', 'Brigadier General', '1st Airborne Brigade Commander', 5),
('Admiral Sakai', 'Admiral', 'Chief of Staff, Maritime Self-Defense Force', 7),
('Rear Admiral Takahashi', 'Rear Admiral', 'Self-Defense Fleet Commander', 8),
('Commodore Ishikawa', 'Commodore', 'Escort Flotilla One Commander', 9),
('Captain Nakamura', 'Captain', 'Submarine Squadron Two Commander', 10),
('Air Vice-Marshal Fujimoto', 'Air Vice-Marshal', 'Air Defense Command Commander', 12),
('Air Commodore Yamada', 'Air Commodore', 'Air Training Command Commander', 13),
('Wing Commander Kobayashi', 'Wing Commander', '1st Air Wing Commander', 14),
('Wing Commander Matsumoto', 'Wing Commander', '2nd Air Wing Commander', 15);