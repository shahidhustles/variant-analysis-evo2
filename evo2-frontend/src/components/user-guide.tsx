/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  ChevronDown,
  BookOpen,
  HelpCircle,
  Rocket,
  Globe,
  Search,
  BarChart3,
  Zap,
  Database,
  Lightbulb,
  Settings,
  Info,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function UserGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Rocket className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Welcome to EVO2 Variant Analysis! This tool helps you predict
            whether DNA mutations are likely to cause disease.
          </p>
          <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-3">
            <p className="font-semibold text-blue-900">What is this tool?</p>
            <p className="mt-1 text-blue-800">
              EVO2 is an AI model trained on billions of DNA letters. It learns
              to recognize which changes break genes and which ones are
              harmless. You give it a mutation, it predicts the risk.
            </p>
          </div>
          <p className="mt-4 font-semibold">Quick Start (2 minutes):</p>
          <ol className="ml-2 list-inside list-decimal space-y-2">
            <li>Select a genome (default: hg38 - human genome)</li>
            <li>Search for a gene (e.g., BRCA1, TP53, LDLR)</li>
            <li>View the gene sequence and known variants</li>
            <li>Predict a mutation or analyze existing variants</li>
          </ol>
        </div>
      ),
    },
    {
      id: "genome-selection",
      title: "Step 1: Select a Genome",
      icon: <Globe className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Genomes are different versions of the reference human genome. Most
            research uses hg38 (GRCh38), which is the current standard.
          </p>
          <div className="rounded bg-gray-50 p-3">
            <p className="font-semibold">What's in the dropdown?</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
              <li>
                <strong>hg38</strong> - Latest human genome (recommended)
              </li>
              <li>
                <strong>hg19</strong> - Previous genome version (older research)
              </li>
              <li>Older versions for historical compatibility</li>
            </ul>
          </div>
          <p className="mt-3 text-gray-600">
            <strong>Research Tip:</strong> If you're comparing your work to
            older papers, check which genome they used. Coordinates change
            between versions!
          </p>
        </div>
      ),
    },
    {
      id: "search-gene",
      title: "Step 2: Search for a Gene",
      icon: <Search className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Search for genes by symbol (e.g., BRCA1, TP53) or scroll through
            chromosomes to browse.
          </p>
          <div className="space-y-3">
            <div className="rounded bg-gray-50 p-3">
              <p className="font-semibold">Using Search:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                <li>Type gene symbol (case-insensitive)</li>
                <li>Results show gene name, chromosome, and description</li>
                <li>Click to select and view details</li>
              </ul>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <p className="font-semibold">Using Browse:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                <li>Select a chromosome from dropdown</li>
                <li>View all genes on that chromosome</li>
                <li>Useful for exploratory research</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-gray-600">
            <strong>Example genes:</strong> BRCA1 (breast cancer), TP53 (cancer
            suppressor), LDLR (cholesterol)
          </p>
        </div>
      ),
    },
    {
      id: "gene-viewer",
      title: "Step 3: View Gene Details",
      icon: <BarChart3 className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>Once you select a gene, you'll see several sections:</p>
          <div className="space-y-3">
            <div className="rounded border-l-4 border-green-400 bg-green-50 p-3">
              <p className="font-semibold text-green-900">Gene Information</p>
              <p className="mt-1 text-green-800">
                Official name, chromosome location, strand direction, and
                description. This is metadata from NCBI Gene database.
              </p>
            </div>
            <div className="rounded border-l-4 border-blue-400 bg-blue-50 p-3">
              <p className="font-semibold text-blue-900">Gene Sequence</p>
              <p className="mt-1 text-blue-800">
                The actual DNA letters (A, T, G, C) that make up this gene.
                Highlighted letters show your currently selected position. This
                data comes from UCSC Genome Browser.
              </p>
            </div>
            <div className="rounded border-l-4 border-purple-400 bg-purple-50 p-3">
              <p className="font-semibold text-purple-900">Known Variants</p>
              <p className="mt-1 text-purple-800">
                Mutations that have been seen in real patients, from the ClinVar
                database. Colors show clinical significance (red = pathogenic,
                green = benign).
              </p>
            </div>
            <div className="rounded border-l-4 border-orange-400 bg-orange-50 p-3">
              <p className="font-semibold text-orange-900">
                Analyze Custom Mutation
              </p>
              <p className="mt-1 text-orange-800">
                Predict the effect of ANY mutation you want to test, not just
                known ones. This is the main feature!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "predict-mutation",
      title: "Step 4: Predict a Mutation",
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>This is where the AI magic happens.</p>
          <div className="my-3 rounded border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="font-semibold text-yellow-900">
              What is a mutation prediction?
            </p>
            <p className="mt-2 text-yellow-800">
              You give us a position in the gene and tell us what DNA letter
              should be there instead. The AI compares the original sequence vs.
              mutated sequence and predicts how harmful the change is.
            </p>
          </div>

          <p className="mt-4 font-semibold">How to fill the form:</p>
          <div className="mt-2 space-y-3">
            <div className="rounded bg-gray-50 p-3">
              <p className="font-mono font-bold text-gray-800">Position</p>
              <p className="mt-1 text-gray-600">
                The genomic coordinate where the mutation occurs. Example:
                43119628 for a BRCA1 variant.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Tip: Click on the gene sequence to auto-fill this field
              </p>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <p className="font-mono font-bold text-gray-800">Reference</p>
              <p className="mt-1 text-gray-600">
                The current DNA letter at that position (the normal/wild-type
                allele). Should be A, T, G, or C.
              </p>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <p className="font-mono font-bold text-gray-800">Alternative</p>
              <p className="mt-1 text-gray-600">
                What you want to change it to. This is the mutation you're
                testing.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Note: Reference and Alternative must be different
              </p>
            </div>
          </div>

          <p className="mt-4 font-semibold">
            Understanding the prediction result:
          </p>
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <p className="font-semibold text-gray-800">
                Likely Pathogenic (Red)
              </p>
              <p className="text-gray-600">
                The mutation probably breaks the gene function
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                Likely Benign (Green)
              </p>
              <p className="text-gray-600">
                The mutation probably doesn't affect gene function
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">📊 Confidence Score</p>
              <p className="text-gray-600">
                How certain the AI is. Higher = more confident. 90%+ = very
                confident. Below 60% = uncertain.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">📈 Delta Score</p>
              <p className="text-gray-600">
                The AI's internal score: negative means harmful, positive means
                neutral/beneficial. More negative = more harmful.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "known-variants",
      title: "Understanding Known Variants",
      icon: <Database className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            The Known Variants table shows mutations that have been documented
            in patients.
          </p>
          <div className="my-3 rounded bg-gray-50 p-3">
            <p className="mb-2 font-semibold">Column Guide:</p>
            <ul className="space-y-2 text-gray-600">
              <li>
                <strong>Position:</strong> Genomic coordinate of the variant
              </li>
              <li>
                <strong>Type:</strong> Missense (changes amino acid), Frameshift
                (disrupts reading), Nonsense (creates stop codon), etc.
              </li>
              <li>
                <strong>ClinVar:</strong> Clinical classification from patient
                data. Red = disease, Green = benign
              </li>
              <li>
                <strong>Evo2 Prediction:</strong> What our AI predicts for this
                variant
              </li>
              <li>
                <strong>Confidence:</strong> How certain the AI is about its
                prediction
              </li>
            </ul>
          </div>

          <p className="mt-4 font-semibold">Why compare ClinVar vs. Evo2?</p>
          <p className="text-gray-600">
            ClinVar is ground truth from patients. Evo2 uses patterns it
            learned. When they match, it validates the AI. When they disagree,
            it might be a limitation of the model.
          </p>

          <p className="mt-4 font-semibold">Analyzing a known variant:</p>
          <p className="text-gray-600">
            Click any row in the table to see a side-by-side comparison. This
            lets you validate how well Evo2 performs against real clinical data.
          </p>
        </div>
      ),
    },
    {
      id: "interpret-results",
      title: "How to Interpret Results",
      icon: <TrendingDown className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p className="mb-2 font-semibold">
            The prediction result has three parts:
          </p>

          <div className="my-3 rounded border-l-4 border-red-400 bg-red-50 p-3">
            <p className="font-semibold text-red-900">
              1. Classification (Pathogenic / Benign)
            </p>
            <p className="mt-1 text-red-800">
              Binary decision: Does this mutation likely cause disease? This is
              based on the delta score and a learned threshold.
            </p>
          </div>

          <div className="my-3 rounded border-l-4 border-blue-400 bg-blue-50 p-3">
            <p className="font-semibold text-blue-900">
              2. Confidence Percentage
            </p>
            <p className="mt-1 text-blue-800">
              NOT the probability the variant causes disease. Rather, it's how
              far from the borderline:
            </p>
            <ul className="mt-2 ml-4 space-y-1 text-blue-800">
              <li>• 95%+ Confident: Clear pathogenic or benign</li>
              <li>• 70-90% Confident: Fairly sure</li>
              <li>• 50-70% Confident: Close to the borderline, less certain</li>
              <li>• Below 50%: Very uncertain, don't trust as much</li>
            </ul>
          </div>

          <div className="my-3 rounded border-l-4 border-green-400 bg-green-50 p-3">
            <p className="font-semibold text-green-900">3. Delta Score</p>
            <p className="mt-1 text-green-800">
              The raw AI score showing how much the mutation changes the
              sequence's "health":
            </p>
            <ul className="mt-2 ml-4 space-y-1 text-green-800">
              <li>• Negative (e.g., -0.005): Loss of function, harmful</li>
              <li>• Close to zero: Little effect</li>
              <li>• Positive: Rare, might improve function</li>
            </ul>
          </div>

          <p className="mt-4 font-semibold">Important Limitations:</p>
          <ul className="space-y-2 text-gray-600">
            <li>
              • <strong>Not clinical diagnosis:</strong> Use as a research tool,
              not for patient care
            </li>
            <li>
              • <strong>Single mutations only:</strong> Can't predict complex
              multi-variant effects
            </li>
            <li>
              • <strong>Human genes focus:</strong> Trained on known human
              variants
            </li>
            <li>
              • <strong>No environmental factors:</strong> Doesn't account for
              diet, lifestyle, etc.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "research-tips",
      title: "Research Tips & Tricks",
      icon: <Lightbulb className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div className="my-3 rounded border-l-4 border-indigo-400 bg-indigo-50 p-3">
            <p className="font-semibold text-indigo-900">
              For Literature Review
            </p>
            <p className="mt-1 text-indigo-800">
              Found a paper with a novel BRCA1 variant? Search it here. See if
              Evo2 agrees with your understanding. Good validation for your
              research.
            </p>
          </div>

          <div className="my-3 rounded border-l-4 border-green-400 bg-green-50 p-3">
            <p className="font-semibold text-green-900">For Thesis/Project</p>
            <p className="mt-1 text-green-800">
              Screening candidate variants for functional study? Use Evo2 to
              prioritize which ones are most likely pathogenic. Saves lab time!
            </p>
          </div>

          <div className="my-3 rounded border-l-4 border-blue-400 bg-blue-50 p-3">
            <p className="font-semibold text-blue-900">For Class Assignment</p>
            <p className="mt-1 text-blue-800">
              Learning about variant pathogenicity? Use this as an interactive
              tool. Predict variants, compare to ClinVar, write up analysis.
            </p>
          </div>

          <p className="mt-4 font-semibold">Best Practices:</p>
          <ul className="space-y-2 text-gray-600">
            <li>
              • Always validate Evo2 predictions against ClinVar data when
              available
            </li>
            <li>
              • Note the confidence score—don't trust 51% confident predictions
            </li>
            <li>
              • For novel variants, cross-reference with other prediction tools
              (PolyPhen, SIFT, VEP)
            </li>
            <li>
              • Document your findings with delta scores for reproducibility
            </li>
            <li>
              • Consider gene function context (cancer suppressor vs. growth
              factor, etc.)
            </li>
          </ul>

          <p className="mt-4 font-semibold">🔗 Useful Resources:</p>
          <ul className="space-y-1 text-gray-600">
            <li>
              • <strong>ClinVar:</strong> www.ncbi.nlm.nih.gov/clinvar (clinical
              variant database)
            </li>
            <li>
              • <strong>UCSC Genome Browser:</strong> genome.ucsc.edu (sequence
              browser)
            </li>
            <li>
              • <strong>NCBI Gene:</strong> www.ncbi.nlm.nih.gov/gene (gene
              information)
            </li>
            <li>
              • <strong>Evo2 Paper:</strong> biorxiv.org (original model
              publication)
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <div className="my-3 rounded border-l-4 border-yellow-400 bg-yellow-50 p-3">
            <p className="font-semibold text-yellow-900">
              Prediction is taking too long
            </p>
            <p className="mt-1 text-yellow-800">
              First prediction loads the AI model (~30s). Subsequent predictions
              are faster (~5-10s). This is normal!
            </p>
          </div>

          <div className="my-3 rounded border-l-4 border-yellow-400 bg-yellow-50 p-3">
            <p className="font-semibold text-yellow-900">
              Error: "Failed to fetch sequence from UCSC"
            </p>
            <p className="mt-1 text-yellow-800">
              UCSC API is temporarily down or you're outside the gene bounds.
              Check position is within gene start/stop coordinates.
            </p>
          </div>

          <div className="my-3 rounded border-l-4 border-yellow-400 bg-yellow-50 p-3">
            <p className="font-semibold text-yellow-900">
              Gene not found in search
            </p>
            <p className="mt-1 text-yellow-800">
              Try different spellings or synonyms. Some genes have multiple
              names. Example: "tumor suppressor p53" vs "TP53"
            </p>
          </div>

          <div className="my-3 rounded border-l-4 border-yellow-400 bg-yellow-50 p-3">
            <p className="font-semibold text-yellow-900">
              Confidence is very low (&lt;55%)
            </p>
            <p className="mt-1 text-yellow-800">
              The variant is close to the decision boundary. Don't rely heavily
              on this prediction. Cross-check with other tools or literature.
            </p>
          </div>

          <p className="mt-4 font-semibold">Still having issues?</p>
          <p className="text-gray-600">
            Check your internet connection. Some features require NCBI/UCSC APIs
            to be accessible. If problems persist, the backend service might be
            down.
          </p>
        </div>
      ),
    },
    {
      id: "about",
      title: "About This Tool",
      icon: <Info className="h-5 w-5" />,
      content: (
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong>EVO2 Variant Analysis</strong> combines state-of-the-art
            genome AI with clinical databases to make variant effect prediction
            accessible to researchers and students.
          </p>

          <div className="my-3 rounded bg-purple-50 p-3">
            <p className="font-semibold text-purple-900">The Model: Evo2</p>
            <p className="mt-1 text-purple-800">
              A 7-billion-parameter language model from the Arc Institute,
              trained on genomic sequences. Like ChatGPT for DNA, but
              specialized for biology.
            </p>
          </div>

          <div className="my-3 rounded bg-purple-50 p-3">
            <p className="font-semibold text-purple-900">Data Sources</p>
            <ul className="mt-2 ml-4 space-y-1 text-purple-800">
              <li>
                • <strong>UCSC Genome Browser:</strong> Reference sequences
                (hg38, hg19, etc.)
              </li>
              <li>
                • <strong>NCBI Gene:</strong> Gene annotations and metadata
              </li>
              <li>
                • <strong>ClinVar:</strong> Clinical variant classifications
              </li>
            </ul>
          </div>

          <div className="my-3 rounded bg-purple-50 p-3">
            <p className="font-semibold text-purple-900">Infrastructure</p>
            <p className="mt-1 text-purple-800">
              Frontend: Next.js + React. Backend: Python FastAPI on Modal cloud
              GPU (H100).
            </p>
          </div>

          <p className="mt-4 font-semibold">Citing This Tool</p>
          <p className="text-gray-600">
            If you use EVO2 in research, cite the original Evo2 paper: [Arc
            Institute publication]
          </p>

          <p className="mt-4 font-semibold">Disclaimer</p>
          <p className="text-xs text-gray-600">
            This is a research tool for educational purposes. NOT for clinical
            diagnosis. Always consult medical professionals for patient care
            decisions.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-[#3c4f3d]" />
            <h1 className="text-3xl font-bold text-[#3c4f3d]">
              User Guide & Documentation
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Learn how to use EVO2 Variant Analysis for your research or
            coursework. This guide is designed for researchers and students with
            any biology background.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Card
              key={section.id}
              className="overflow-hidden border-l-4 border-l-[#de8246]"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left transition-colors hover:bg-gray-50"
              >
                <CardHeader className="flex cursor-pointer flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg text-[#3c4f3d]">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-[#de8246] transition-transform ${
                      expandedSection === section.id ? "rotate-180" : ""
                    }`}
                  />
                </CardHeader>
              </button>
              {expandedSection === section.id && (
                <CardContent className="border-t border-gray-200 pt-0 pb-4">
                  {section.content}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <HelpCircle className="h-5 w-5" />
              Quick FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-green-900">
                Q: Is this 100% accurate?
              </p>
              <p className="mt-1 text-green-800">
                A: No tool is perfect. Evo2 is ~87% accurate when compared to
                ClinVar data. Always validate with additional evidence.
              </p>
            </div>
            <div>
              <p className="font-semibold text-green-900">
                Q: Can I use this clinically?
              </p>
              <p className="mt-1 text-green-800">
                A: No. This is for research and education only. Clinical
                decisions require licensed geneticists and comprehensive
                testing.
              </p>
            </div>
            <div>
              <p className="font-semibold text-green-900">
                Q: What organisms does this work for?
              </p>
              <p className="mt-1 text-green-800">
                A: Currently focused on human genomes (hg38, hg19). The Evo2
                model can theoretically work on any organism but would need
                variant training data.
              </p>
            </div>
            <div>
              <p className="font-semibold text-green-900">
                Q: How long are predictions?
              </p>
              <p className="mt-1 text-green-800">
                A: First prediction: 5-30 seconds (loading AI model). Later
                predictions: 5-10 seconds. Network speed matters!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 rounded border-l-4 border-blue-400 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Start with "Getting Started" section
            above, then jump to specific topics as needed. Expand any section to
            learn more.
          </p>
        </div>
      </div>
    </div>
  );
}
