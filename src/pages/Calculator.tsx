import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

// Types
type QA = [string, string];

interface Row {
  Question: string;
  Answer: string;
}

// Question banks (ported from Streamlit code)
const question1: QA[] = [
  [
    "Will you be communicating with a launch vehicle, spacecraft, satellite, or U.S. based earth station via inter-satellite link, uplink or downlink? ",
    "FCC – Satellites and earth stations",
  ],
  [
    "Will you be responsible for authorizing the launch of a suborbital or orbital vehicle that’s not an Amateur Rocket? ",
    "FAA - AST",
  ],
  [
    "Are you seeking to authorize a payload that isn’t subject to the FCC or CRSRA’s authorities as a communications or remote sensing satellite? (It hasn’t been done before commercially or is high risk due to things like nuclear propulsion, etc.) ",
    "FAA - AST",
  ],
  ["Will your mission involve human space flight? ", "FAA - AST"],
  [
    "Are you seeking to authorize a spaceport, a launch site or reentry site for other than Amateur Rockets for multiple vehicle operators? ",
    "FAA - AST",
  ],
  [
    "Will you have cameras or sensors onboard your spacecraft or satellite that image the Earth intentionally or unintentionally? Star trackers are excluded. ",
    "Commerce - NOAA",
  ],
  ["Are you a manufacturer or exporter of Defense Articles?", "State – DDTC"],
  [
    "Are you a US Person or Company or a Foreign Person located in the US that is Brokering Defense Articles?",
    "State – DDTC",
  ],
  [
    "Are you a Foreign Person employing or contracting with US Persons for a Defense Service? Example: Hiring US rocket propulsion engineers or using a US company for testing and integration services supporting a US launch vehicle",
    "State – DDTC",
  ],
  [
    "Are you a US Person employing a Foreign Person to work on ITAR controlled Technical Data?",
    "State – DDTC",
  ],
  ["Do you intend to temporarily import Defense Articles into the US?", "State – DDTC"],
  [
    "Are you a foreign company utilizing US origin Technical Data or integrating ITAR controlled components in your final product?",
    "State – DDTC",
  ],
  [
    "Are you a US Person employing a Foreign Person to work on EAR controlled Technology? ",
    "Commerce – BIS",
  ],
  [
    "Are you a foreign company utilizing US origin Technology or integrating EAR controlled components in your final product?",
    "Commerce – BIS",
  ],
];

const question2fcc2: QA[] = [
  ["Will the mission be experimental?", "6-12 months for experimental space stations. Less for earth stations. \n"],
  [
    "Will the mission be a commercial licensing of a space station operating in geostationary orbit?",
    "12-18 months \n",
  ],
  [
    "If licensing a commercial space station, will your system qualify as a small satellite system?",
    "3-12 months \n",
  ],
  [
    "If licensing a commercial space station, will your non-geostationary satellite system use 20 or more earth stations?",
    "6 months to 2 years depending on spectral allocation (update,test) \n",
  ],
  [
    "If licensing a commercial space station, will your non-geostationary satellite system use less than 20 earth stations?",
    "6 months to 1.5 years depending on spectral allocation \n",
  ],
  [
    "If licensing an earth station, will your earth station be mobile?",
    "6-18 months \n",
  ],
  ["If licensing an earth station, will it be for a single site?", "3-12 months \n"],
  ["If licensing an earth station, will it be for ubiquitous use?", "8-18 months \n"],
  ["Do you plan to license and operate your own earth stations?", "4-12 months \n"],
];

const question2faa: QA[] = [
  [
    "Are you a US launch provider looking to establish your first launch?",
    "120 to 180 days upon application acceptance.\n",
  ],
  [
    "Are you a US launch company looking to launch in another country?",
    "120 to 180 days upon application acceptance.\n",
  ],
  [
    "Are you requesting a payload review because you have a novel payload?",
    "120 to 180 days upon application acceptance.\n",
  ],
  [
    "Are you an established launch company seeking to use a new launch site for your vehicle?",
    "120 to 180 days upon application acceptance.\n",
  ],
  ["Are you seeking approval for human spaceflight?", "120 to 180 days upon application acceptance.\n"],
  [
    "Are you a launch company seeking payload review prior to launch?",
    "Your timeline is subject to the launch licensing timelines, and you should coordinate with the launch provider for estimates.\n",
  ],
  ["Are you seeking to establish a new spaceport?", "120 to 180 days upon application acceptance.\n"],
];

const question2noaa: QA[] = [[
  "Will you be conducting Remote Sensing operations?",
  "2 weeks to 2 months\n",
]];

const question2bis: QA[] = [
  [
    "Do you need to authorize an exchange of EAR controlled Technology with a Foreign entity or Person from a Cooperating Country?",
    "1 to 3 months.\n",
  ],
  ["Do you need to ship EAR controlled hardware to a Foreign Person?", "1 to 3 months.\n"],
  [
    "Is the end use of your hardware, software, or technology export for military, intelligence, or weapons purposes?",
    "You may not be allowed to complete this transaction. More information is needed.\n",
  ],
  [
    "Are any parties to your business transaction(s) identified sanctioned by the Office of Foreign Asset Control or on one of the lists maintained in the Consolidated Screening List search tool? (see link to tool in definitions)",
    "State – DDTC and Commerce – BIS: You may not be allowed to complete this transaction. More information is needed.\n",
  ],
  [
    "Are any nationalities or parties to the transaction from or in a country found in the Prohibited Countries Lists (see definitions section and refer to Table 1 and Table 2 of 22 CFR 126.1)",
    "State – DDTC and Commerce – BIS: You may not be allowed to complete this transaction. More information is needed.\n",
  ],
];

const question2ddtc: QA[] = [
  [
    "Do you need to authorize the export of a Defense Article that is considered Missile Technology to a NATO country?",
    "This action is likely prohibited in most circumstances.\n",
  ],
  [
    "Do you need to authorize the export of a Defense Article that is considered Significant Military Equipment to a NATO country?",
    "2 to 4 months with additional documentation requirements.\n",
  ],
  [
    "Do you need to authorize the export of a Defense Article to a NATO country?",
    "2 to 4 months.\n",
  ],
  [
    "Do you need to authorize the transmission of Technical Data to a Foreign Person employee?",
    "6 to 9 months for NATO nationalities. Longer timelines for other nationalities. Some nationalities may not be approves at all depending on the sensitivity of the export.\n",
  ],
  [
    "Do you need to authorize the export of a Defense Article to a non-NATO country?",
    "3 to 6 months. Certain countries are prohibited altogether, or a license is unlikely to be granted.\n",
  ],
  [
    "Do you need to authorize ongoing exchange of Technical Data with another country?",
    "A TAA may take anywhere from 6 months to more than a year depending on sensitivity of the data, the nationalities involved, and the complexity of the Agreement. Some Agreements may not be authorized at all or include many restrictions.\n",
  ],
  [
    "Do you need to authorize the manufacture of a Defense Article in another country?",
    "An MLA may take anywhere from 6 months to more than a year depending on sensitivity of the data, the nationalities involved, and the complexity of the Agreement. Some Agreements may not be authorized at all or include many restrictions.\n",
  ],
];

const question3fcc2: QA[] = [
  [
    "Will the mission be experimental?",
    "- FCC charges $140 application fee and no regulatory fee for experimental missions.\n",
  ],
  [
    "Will the mission be commercial?",
    "- FCC: Please note that regulatory fees will be due for authorizations for operational systems that are held as of October 1 of the previous year for commercial missions.\n",
  ],
  [
    "If licensing a space station, will your space station operate in geostationary orbit? ",
    "- FCC charges $3,965 and a regulatory fee of $144,155 for geostationary orbits. ",
  ],
  [
    "If licensing a space station, will your system qualify as a small satellite system or an in-space servicing, assembly, and manufacturing system?",
    "- FCC charges $2,425 and a regulatory fee of $12,215 for small satellite systems. ",
  ],
  [
    "If licensing a space station, will your non-geostationary satellite system use 20 or more earth stations?",
    "- FCC charges a $16,795 application fee and regulatory fee of $964,200.",
  ],
  [
    "If licensing a space station, will your non-geostationary satellite system use less than 20 earth stations?",
    "- FCC charges a $16,795 application fee and regulatory fee of $441,925.",
  ],
  [
    "If licensing a earth station, will your earth station be mobile?",
    "- FCC charges $910 and a $2610 regulatory fee for mobile earth stations. ",
  ],
  [
    "If licensing a earth station, will it be for a single site?",
    "- FCC charges $400 and $575 regulatory fee for single sites. ",
  ],
  [
    "If licensing an earth station, will it be for ubiquitous use (not a single site)?",
    "- FCC charges $400 and a $2610 regulatory fee for ubiquitous use. ",
  ],
  [
    "If licensing a earth station, will it be for multiple sites?",
    "- FCC charges $7,270 and a $2610 regulatory fee for multiple sites.",
  ],
];

const question3faa = [
  "- The license application processes under the FAA are free. Certain studies or documents that must be provided by other agencies to the FAA may cost money.\n",
];
const question3noaa = [
  "- The licensing process under NOAA is free, but there may be costs associated with hiring external expertise to compile data necessary for the application.\n",
];
const question3bis = [
  "- The licensing process under BIS is free, but there may be costs associated with hiring external expertise to provide classification and licensing support.\n",
];
const question3ddtc = [
  "- If you are manufacturing, Brokering, or exporting Defense Articles, you are required to register with DDTC. The registration for manufacturers and exporters is $2,250 for the first year with recurring fees. Broker registration is $2250. The first ten licenses are included in the registration fee. More information on how these fees are calculated can be found at https://www.pmddtc.state.gov/ddtc_public/ddtc_public?id=ddtc_kb_article_page&sys_id=cfd40adedbf0130044f9ff621f9619d2\n",
];

function uniquePush(list: string[], item: string) {
  if (!list.includes(item)) return [...list, item];
  return list;
}

function downloadCSV(data: Row[], filename: string) {
  const csvContent = [
    "Question,Answer",
    ...data.map(row => `"${row.Question.replace(/"/g, '""')}","${row.Answer.replace(/"/g, '""')}"`)
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Calculator() {
  // SEO basics
  useEffect(() => {
    document.title = "Space Regulatory Calculator – Aegis";
    const desc =
      "Calculate agencies to contact, timelines, and estimated regulatory costs for U.S. space missions.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  // State
  const [stage, setStage] = useState<number>(0);
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [agencies, setAgencies] = useState<string[]>([]);
  const [queueStage2, setQueueStage2] = useState<string[]>([]);
  const [queueStage3, setQueueStage3] = useState<string[]>([]);
  const [all1, setAll1] = useState<Row[]>([]);
  const [all2, setAll2] = useState<Row[]>([]);
  const [answer3, setAnswer3] = useState<string[]>([]);

  // Current agency for Stage 2 and Stage 3
  const currentAgency = useMemo(() => queueStage2[0], [queueStage2]);

  function getQsetForAgencyStage2(agency?: string): QA[] {
    switch (agency) {
      case "FCC – Satellites and earth stations":
        return question2fcc2;
      case "FAA - AST":
        return question2faa;
      case "Commerce - NOAA":
        return question2noaa;
      case "Commerce – BIS":
        return question2bis;
      case "State – DDTC":
        return question2ddtc;
      default:
        return [];
    }
  }

  // Stage 2 and 3 auto-processing for non-FCC agencies in Stage 3
  useEffect(() => {
    if (stage !== 2) return;

    // If Stage 2 queue is empty, move to Stage 3
    if (queueStage2.length === 0) {
      setCurrentQ(0);
      setQueueStage3(agencies);
      setStage(2); // remain in 2 for a moment to process Stage 3 auto-adds below
    }
  }, [stage, queueStage2.length, agencies]);

  useEffect(() => {
    if (stage !== 2) return;

    // Process Stage 3 auto-adds (non-FCC) and advance to Stage 3 when done
    const hasFCC = queueStage3.includes("FCC – Satellites and earth stations");
    const others = queueStage3.filter((a) => a !== "FCC – Satellites and earth stations");

    if (others.length > 0) {
      const extras: string[] = [];
      if (others.includes("FAA - AST")) extras.push(...question3faa);
      if (others.includes("Commerce - NOAA")) extras.push(...question3noaa);
      if (others.includes("Commerce – BIS")) extras.push(...question3bis);
      if (others.includes("State – DDTC")) extras.push(...question3ddtc);

      if (extras.length) setAnswer3((prev) => [...prev, ...extras]);

      // Remove processed ones
      setQueueStage3((prev) => prev.filter((a) => a === "FCC – Satellites and earth stations"));
      return; // wait for next render to proceed
    }

    // If only FCC remains, we still stay in Stage 2 UI to ask FCC cost questions
    if (hasFCC) return;

    // Nothing left -> go to Stage 3 summary
    if (queueStage3.length === 0) {
      setStage(3);
    }
  }, [stage, queueStage3]);

  // Handlers
  const handleYes = () => {
    if (stage === 0) {
      const qa = question1[currentQ];
      if (!qa) return;
      const [, agency] = qa;
      setAgencies((prev) => uniquePush(prev, agency));
      setAll1((prev) => [...prev, { Question: qa[0], Answer: agency }]);
      const next = currentQ + 1;
      if (next >= question1.length) {
        setStage(1);
        setQueueStage2((prev) => [...agencies, agency]); // ensure inclusion of last agency
        setCurrentQ(0);
      } else {
        setCurrentQ(next);
      }
    } else if (stage === 1) {
      const qa = getQsetForAgencyStage2(currentAgency)[currentQ];
      if (!qa) return;
      const [qText, aText] = qa;
      setAll2((prev) => [
        ...prev,
        { Question: qText, Answer: `${currentAgency}: ${aText}` },
      ]);
      const next = currentQ + 1;
      const qset = getQsetForAgencyStage2(currentAgency);
      if (next >= qset.length) {
        // Done with this agency
        setQueueStage2((prev) => prev.slice(1));
        setCurrentQ(0);
        if (queueStage2.length <= 1) {
          // Was the last agency -> advance stage
          setStage(2);
          setQueueStage3(agencies);
        }
      } else {
        setCurrentQ(next);
      }
    } else if (stage === 2) {
      // FCC cost questions (the only interactive part in Stage 2 for costs)
      if (queueStage3.includes("FCC – Satellites and earth stations")) {
        const qa = question3fcc2[currentQ];
        if (!qa) return;
        const [, costText] = qa;
        setAnswer3((prev) => uniquePush(prev, costText));
        const next = currentQ + 1;
        if (next >= question3fcc2.length) {
          // remove FCC and proceed to summary
          setQueueStage3((prev) => prev.filter((a) => a !== "FCC – Satellites and earth stations"));
          setCurrentQ(0);
          setStage(3);
        } else {
          setCurrentQ(next);
        }
      }
    }
  };

  const handleNo = () => {
    if (stage === 0) {
      const next = currentQ + 1;
      if (next >= question1.length) {
        setStage(1);
        setQueueStage2(agencies);
        setCurrentQ(0);
      } else {
        setCurrentQ(next);
      }
    } else if (stage === 1) {
      const next = currentQ + 1;
      const qset = getQsetForAgencyStage2(currentAgency);
      if (next >= qset.length) {
        // Done with this agency
        setQueueStage2((prev) => prev.slice(1));
        setCurrentQ(0);
        if (queueStage2.length <= 1) {
          setStage(2);
          setQueueStage3(agencies);
        }
      } else {
        setCurrentQ(next);
      }
    } else if (stage === 2) {
      if (queueStage3.includes("FCC – Satellites and earth stations")) {
        const next = currentQ + 1;
        if (next >= question3fcc2.length) {
          setQueueStage3((prev) => prev.filter((a) => a !== "FCC – Satellites and earth stations"));
          setCurrentQ(0);
          setStage(3);
        } else {
          setCurrentQ(next);
        }
      }
    }
  };

  // UI helpers
  const renderIntro = () => (
    <section className="space-y-4 text-left max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Space Regulatory Calculator</h1>
      <p className="text-muted-foreground">
        This calculator is for U.S. commercial space companies that want to understand the
        potential complexity, time, and cost involved in navigating the federal regulatory landscape.
      </p>
      <p className="text-muted-foreground">
        Regulatory compliance is a requirement for U.S. companies and circumvention or noncompliance may lead to fines, penalties,
        and even incarceration.
      </p>
      <p className="text-muted-foreground">
        To use the calculator, answer a series of “yes/no” questions about one mission. The more defined your mission, the better
        answers you’ll receive. Some regulatory timelines and fees will stack or run in parallel. Based on your input, the calculator
        will give you probable answers or answer ranges to three main questions:
      </p>
      <ol className="list-decimal pl-6 text-muted-foreground space-y-1">
        <li>What agencies do I need to talk to?</li>
        <li>On what timeline should I talk to those agencies prior to launch?</li>
        <li>How much will the regulatory process cost?</li>
      </ol>
      <p className="text-muted-foreground">
        The calculator can’t be 100% accurate based on “yes/no” questions, but it should give a good overview of what your mission might
        take on the regulatory side. This version looks at five regulators (NOAA, FCC, FAA, DDTC, and BIS). More agencies may be involved
        depending on your operations, mission scope, and external variables like corporate ownership and funding sources.
      </p>
      <p className="text-muted-foreground">
        While this calculator estimates regulatory costs for space activities, you may incur additional discretionary costs (e.g., legal fees,
        consultants) in preparing submissions.
      </p>
      <p className="text-muted-foreground">For more resources, reach out to Aegis at hello@aegis.law.</p>
      <div className="text-sm">
        <h3 className="font-medium mb-2">Definitions</h3>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M/part-120/subpart-C/section-120.62" target="_blank" rel="noreferrer">US Person</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/section-120.63" target="_blank" rel="noreferrer">Foreign Person</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/section-120.32" target="_blank" rel="noreferrer">Defense Service</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M/part-120/subpart-C/section-120.31" target="_blank" rel="noreferrer">Defense Article</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-772" target="_blank" rel="noreferrer">Technology</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/section-120.33" target="_blank" rel="noreferrer">Technical Data</a></li>
          <li><a className="underline" href="https://www.bis.doc.gov/index.php/documents/regulations-docs/2255-supplement-no-1-to-part-740-country-groups-1" target="_blank" rel="noreferrer">Cooperating Country</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-101/subpart-C/section-101.22" target="_blank" rel="noreferrer">Amateur Rocket</a></li>
          <li title="For the purposes of this calculator means an activity that has no established regulatory path or precedent.">Novel Activities</li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/part-129#p-129.2(a)" target="_blank" rel="noreferrer">Brokering</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-47/part-2#p-2.1(Space%20Station)" target="_blank" rel="noreferrer">Space Station</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-47/part-2#p-2.1(Earth%20Station)" target="_blank" rel="noreferrer">Earth Station</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-15/part-960#p-960.4(Remote%20sensing)" target="_blank" rel="noreferrer">Remote Sensing</a></li>
          <li><a className="underline" href="https://www.fcc.gov/space/small-satellite-and-small-spacecraft-licensing-process" target="_blank" rel="noreferrer">Small Satellite System</a></li>
          <li><a className="underline" href="https://www.trade.gov/consolidated-screening-list" target="_blank" rel="noreferrer">Consolidated Screening List</a></li>
          <li><a className="underline" href="https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M/part-126/section-126.1" target="_blank" rel="noreferrer">Prohibited Countries List</a></li>
        </ul>
      </div>
    </section>
  );

  const renderStageHeader = () => {
    switch (stage) {
      case 0:
        return (
          <h2 className="text-2xl font-semibold text-center">Section 1. What agencies do I need to talk to?</h2>
        );
      case 1:
        return (
          <h2 className="text-2xl font-semibold text-center">Section 2. Timelines before launch</h2>
        );
      case 2:
        return (
          <h2 className="text-2xl font-semibold text-center">Section 3. Estimated regulatory costs</h2>
        );
      case 3:
        return (
          <h2 className="text-2xl font-semibold text-center">Summary</h2>
        );
      default:
        return null;
    }
  };

  const renderQuestion = () => {
    if (stage === 0) {
      const qa = question1[currentQ];
      return qa ? qa[0] : "";
    }
    if (stage === 1) {
      const qset = getQsetForAgencyStage2(currentAgency);
      const qa = qset[currentQ];
      return qa ? qa[0] : queueStage2.length === 0 ? "Moving to next section..." : "";
    }
    if (stage === 2) {
      if (queueStage3.includes("FCC – Satellites and earth stations")) {
        const qa = question3fcc2[currentQ];
        return qa ? qa[0] : "";
      }
      return "Processing costs...";
    }
    return "";
  };

  const SummaryTable = ({ rows, title }: { rows: Row[]; title: string }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-medium">{title}</h3>
        {rows.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCSV(rows, `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`)}
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={idx}>
              <TableCell className="align-top">{r.Question}</TableCell>
              <TableCell className="align-top whitespace-pre-wrap">{r.Answer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <main className="min-h-screen py-10 container">
      {renderIntro()}

      <div className="mt-10 space-y-6">
        {renderStageHeader()}

        {/* Question */}
        {(stage === 0 || stage === 1 || stage === 2) && (
          <section className="text-center space-y-4">
            <p className="text-lg">{renderQuestion()}</p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleYes}>Yes</Button>
              <Button variant="secondary" onClick={handleNo}>No</Button>
            </div>
          </section>
        )}

        {/* Live summaries */}
        {(stage >= 1 || all1.length > 0) && (
          <section className="space-y-2">
            {all1.length > 0 ? (
              <SummaryTable rows={all1} title="You need to talk to:" />
            ) : (
              <>
                <h3 className="text-xl font-medium">You need to talk to:</h3>
                <p className="text-muted-foreground">No agencies selected yet.</p>
              </>
            )}
          </section>
        )}

        {stage >= 1 && (
          <section className="space-y-2">
            {all2.length > 0 ? (
              <SummaryTable rows={all2} title="Your timeline is:" />
            ) : (
              <>
                <h3 className="text-xl font-medium">Your timeline is:</h3>
                <p className="text-muted-foreground">Answer Section 2 questions to see timelines.</p>
              </>
            )}
          </section>
        )}

        {stage >= 3 && (
          <section className="space-y-2">
            {answer3.length > 0 ? (
              <SummaryTable 
                rows={answer3.map(cost => ({ Question: "Cost Item", Answer: cost }))} 
                title="Your costs are:" 
              />
            ) : (
              <>
                <h3 className="text-xl font-medium">Your costs are:</h3>
                <p className="text-muted-foreground">No costs computed.</p>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
