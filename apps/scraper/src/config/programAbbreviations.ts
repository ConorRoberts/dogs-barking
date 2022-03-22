const programAbbreviations = [
	[
		"Applied Human Nutrition",
		"AHN"
	],
	[
		"Child Studies",
		"CSTU"
	],
	[
		"Family Studies and Human Development",
		"FSHD"
	],
	[
		"Anthropology",
		"ANTH"
	],
	[
		"Anthropology Co-op",
		"ANTH:C"
	],
	[
		"Art History",
		"ARTH"
	],
	[
		"Arts Management",
		"AM"
	],
	[
		"Business",
		"BUS"
	],
	[
		"Business Economics",
		"BECN"
	],
	[
		"Classical Studies",
		"CLAS"
	],
	[
		"Computing and Information Science",
		"CIS"
	],
	[
		"Creative Writing",
		"CW"
	],
	[
		"Criminal Justice and Public Policy",
		"CJPP"
	],
	[
		"Criminal Justice and Public Policy Co-op",
		"CJPP:C"
	],
	[
		"Culture and Technology Studies",
		"CTS"
	],
	[
		"Economics",
		"ECON"
	],
	[
		"Economics Co-op",
		"ECON:C"
	],
	[
		"English",
		"ENGL"
	],
	[
		"Environmental Governance",
		"EGOV"
	],
	[
		"Environmental Governance Co-op",
		"EGOV:C"
	],
	[
		"European Culture and Civilization",
		"ECC"
	],
	[
		"European Studies",
		"EURS"
	],
	[
		"Family and Child Studies",
		"FCS"
	],
	[
		"Food, Agricultural and Resource Economics",
		"FARE"
	],
	[
		"Food, Agricultural and Resource Economics Co-op",
		"FARE:C"
	],
	[
		"French Studies",
		"FREN"
	],
	[
		"Geography",
		"GEOG"
	],
	[
		"Geography Co-op",
		"GEOG:C"
	],
	[
		"German",
		"GERM"
	],
	[
		"History",
		"HIST"
	],
	[
		"History Co-op",
		"HIST:C"
	],
	[
		"Human Resources",
		"HR"
	],
	[
		"International Development Studies",
		"IDS"
	],
	[
		"International Development Studies Co-op",
		"IDS:C"
	],
	[
		"Italian",
		"ITAL"
	],
	[
		"Justice and Legal Studies",
		"JLS"
	],
	[
		"Justice and Legal Studies Co-op",
		"JLS:C"
	],
	[
		"Marketing",
		"MKTG"
	],
	[
		"Mathematical Economics",
		"MAEC"
	],
	[
		"Mathematical Economics Co-op",
		"MAEC:C"
	],
	[
		"Mathematical Science",
		"MSCI"
	],
	[
		"Mathematics",
		"MATH"
	],
	[
		"Media & Cinema Studies",
		"MCST"
	],
	[
		"Museum Studies",
		"MS"
	],
	[
		"Music",
		"MUSC"
	],
	[
		"Philosophy",
		"PHIL"
	],
	[
		"Political Science",
		"POLS"
	],
	[
		"Political Science Co-op",
		"POLS:C"
	],
	[
		"Psychology",
		"PSYC"
	],
	[
		"Psychology Co-op",
		"PSYC:C"
	],
	[
		"Sociology",
		"SOC"
	],
	[
		"Spanish and Hispanic Studies",
		"SPAH"
	],
	[
		"Statistics",
		"STAT"
	],
	[
		"Studio Art",
		"SART"
	],
	[
		"Theatre Studies",
		"THST"
	],
	[
		"Environmental Management Major",
		"EM"
	],
	[
		"Environmental Management Major Co-op",
		"EM:C"
	],
	[
		"Equine Management Major",
		"EQM"
	],
	[
		"Equine Management Major Co-op",
		"EQM:C"
	],
	[
		"Food Industry Management",
		"FIM"
	],
	[
		"Food Industry Management Co-op",
		"FIM:C"
	],
	[
		"Accounting",
		"ACCT"
	],
	[
		"Accounting Co-op",
		"ACCT:C"
	],
	[
		"Business",
		"BUS"
	],
	[
		"Business Data Analytics",
		"BDA"
	],
	[
		"Business Economics",
		"BECN"
	],
	[
		"Economics",
		"ECON"
	],
	[
		"Entrepreneurship",
		"ENT"
	],
	[
		"Food and Agricultural Business",
		"FAB"
	],
	[
		"Food and Agricultural Business Co-op",
		"FAB:C"
	],
	[
		"Government, Economics and Management",
		"GEM"
	],
	[
		"Government, Economics and Management Co-op",
		"GEM:C"
	],
	[
		"Hospitality and Tourism Management",
		"HTM"
	],
	[
		"Hospitality and Tourism Management Co-op",
		"HTM:C"
	],
	[
		"Human Resources",
		"HR"
	],
	[
		"International Business",
		"IB"
	],
	[
		"Management",
		"MGMT"
	],
	[
		"Management Co-op",
		"MGMT:C"
	],
	[
		"Management Economics and Finance",
		"MEF"
	],
	[
		"Management Economics and Finance Co-op",
		"MEF:C"
	],
	[
		"Marketing",
		"MKTG"
	],
	[
		"Marketing Management",
		"MKMN"
	],
	[
		"Marketing Management Co-op",
		"MKMN:C"
	],
	[
		"Project Management",
		"PM"
	],
	[
		"Real Estate",
		"RE"
	],
	[
		"Real Estate Co-op",
		"RE:C"
	],
	[
		"Sport and Event Management",
		"SPMT"
	],
	[
		"Sport and Event Management Co-op",
		"SPMT:C"
	],
	[
		"Sustainable Business",
		"SB"
	],
	[
		"Computer Science",
		"CS"
	],
	[
		"Computer Science Co-op",
		"CS:C"
	],
	[
		"Software Engineering",
		"SENG"
	],
	[
		"Software Engineering Co-op",
		"SENG:C"
	],
	[
		"Biological Engineering Program",
		"BIOE"
	],
	[
		"Biological Engineering Program Co-op",
		"BIOE:C"
	],
	[
		"Biomedical Engineering Program",
		"BME"
	],
	[
		"Biomedical Engineering Program Co-op",
		"BME:C"
	],
	[
		"Computer Engineering Program",
		"CENG"
	],
	[
		"Computer Engineering Program Co-op",
		"CENG:C"
	],
	[
		"Engineering Systems and Computing Program",
		"ESC"
	],
	[
		"Engineering Systems and Computing Program Co-op",
		"ESC:C"
	],
	[
		"Environmental Engineering Program",
		"ENVE"
	],
	[
		"Environmental Engineering Program Co-op",
		"ENVE:C"
	],
	[
		"Food Engineering",
		"FENG"
	],
	[
		"Mechanical Engineering Program",
		"MECH"
	],
	[
		"Mechanical Engineering Program Co-op",
		"MECH:C"
	],
	[
		"Water Resources Engineering Program",
		"WRE"
	],
	[
		"Water Resources Engineering Program Co-op",
		"WRE:C"
	],
	[
		"Animal Biology",
		"ABIO"
	],
	[
		"Applied Geomatics",
		"AG"
	],
	[
		"Bio-Medical Science",
		"BIOM"
	],
	[
		"Biochemistry",
		"BIOC"
	],
	[
		"Biochemistry Co-op",
		"BIOC:C"
	],
	[
		"Biodiversity",
		"BIOD"
	],
	[
		"Biological and Medical Physics",
		"BMPH"
	],
	[
		"Biological and Medical Physics Co-op",
		"BMPH:C"
	],
	[
		"Biological and Pharmaceutical Chemistry",
		"BPCH"
	],
	[
		"Biological and Pharmaceutical Chemistry Co-op",
		"BPCH:C"
	],
	[
		"Biological Science",
		"BIOS"
	],
	[
		"Biology",
		"BIOL"
	],
	[
		"Biomedical Toxicology",
		"BTOX"
	],
	[
		"Biomedical Toxicology Co-op",
		"BTOX:C"
	],
	[
		"Biotechnology",
		"BIOT"
	],
	[
		"Business Economics",
		"BECN"
	],
	[
		"Chemical Physics",
		"CHPY"
	],
	[
		"Chemical Physics Co-op",
		"CHPY:C"
	],
	[
		"Chemistry",
		"CHEM"
	],
	[
		"Chemistry Co-op",
		"CHEM:C"
	],
	[
		"Computing and Information Science",
		"CIS"
	],
	[
		"Ecology",
		"ECOL"
	],
	[
		"Environmental Biology",
		"ENVB"
	],
	[
		"Environmental Geomatics",
		"EG"
	],
	[
		"Environmental Geomatics Co-op",
		"EG:C"
	],
	[
		"Food Science",
		"FOOD"
	],
	[
		"Food Science Co-op",
		"FOOD:C"
	],
	[
		"Human Kinetics",
		"HK"
	],
	[
		"Marine and Freshwater Biology",
		"MFB"
	],
	[
		"Marine and Freshwater Biology Co-op",
		"MFB:C"
	],
	[
		"Mathematical Science",
		"MSCI"
	],
	[
		"Mathematics",
		"MATH"
	],
	[
		"Microbiology",
		"MICR"
	],
	[
		"Microbiology Co-op",
		"MICR:C"
	],
	[
		"Molecular Biology and Genetics",
		"MBG"
	],
	[
		"Molecular Biology and Genetics Co-op",
		"MBG:C"
	],
	[
		"Nanoscience",
		"NANO"
	],
	[
		"Nanoscience Co-op",
		"NANO:C"
	],
	[
		"Neuroscience",
		"NEUR"
	],
	[
		"Nutritional and Nutraceutical Sciences",
		"NANS"
	],
	[
		"Physical Science",
		"PSCI"
	],
	[
		"Physics",
		"PHYS"
	],
	[
		"Physics Co-op",
		"PHYS:C"
	],
	[
		"Plant Science",
		"PLSC"
	],
	[
		"Plant Science Co-op",
		"PLSC:C"
	],
	[
		"Statistics",
		"STAT"
	],
	[
		"Theoretical Physics",
		"THPY"
	],
	[
		"Wildlife Biology and Conservation",
		"WBC"
	],
	[
		"Zoology",
		"ZOO"
	],
	[
		"Agriculture",
		"AGR"
	],
	[
		"Animal Science",
		"ANSC"
	],
	[
		"Crop Science",
		"CRSC"
	],
	[
		"Honours Agriculture",
		"AGRS"
	],
	[
		"Horticulture",
		"HRT"
	],
	[
		"Ecology",
		"ECOL"
	],
	[
		"Ecology Co-op",
		"ECOL:C"
	],
	[
		"Environment and Resource Management",
		"ERM"
	],
	[
		"Environment and Resource Management Co-op",
		"ERM:C"
	],
	[
		"Environmental Economics and Policy",
		"EEP"
	],
	[
		"Environmental Economics and Policy Co-op",
		"EEP:C"
	],
	[
		"Environmental Sciences",
		"ENVS"
	],
	[
		"Environmental Sciences Co-op",
		"ENVS:C"
	]
];

export default programAbbreviations;