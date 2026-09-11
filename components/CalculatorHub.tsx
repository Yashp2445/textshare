"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Calculator,
  Landmark,
  TrendingUp,
  ShieldCheck,
  Receipt,
  Wallet,
  PiggyBank,
  Building2,
  Coins,
  Activity,
  Cake,
  CalendarDays,
  Percent,
  GraduationCap,
  Fuel,
  Tag,
  Scale,
  Search,
} from "lucide-react";

// Import all calculators
import { ScientificCalculator } from "@/components/ScientificCalculator";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { LoanEligibilityCalculator } from "@/components/calculators/LoanEligibilityCalculator";
import { GstCalculator } from "@/components/calculators/GstCalculator";
import { SalaryInHandCalculator } from "@/components/calculators/SalaryInHandCalculator";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { CgpaPercentageCalculator } from "@/components/calculators/CgpaPercentageCalculator";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import { FuelCostCalculator } from "@/components/calculators/FuelCostCalculator";
import { DiscountMarkupCalculator } from "@/components/calculators/DiscountMarkupCalculator";
import { TipCalculator } from "@/components/calculators/TipCalculator";
import { DateDifferenceCalculator } from "@/components/calculators/DateDifferenceCalculator";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { FdRdCalculator } from "@/components/calculators/FdRdCalculator";
import { HomeLoanPrepaymentCalculator } from "@/components/calculators/HomeLoanPrepaymentCalculator";
import { UnitConverter } from "@/components/calculators/UnitConverter";

export interface CalcMenuItem {
  id: string;
  label: string;
  category: "General Tools" | "Finance" | "Health & Personal" | "General / Utilities";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const CALCULATOR_ITEMS: CalcMenuItem[] = [
  // General Tools
  {
    id: "scientific",
    label: "Scientific Calculator",
    category: "General Tools",
    icon: Sparkles,
    desc: "Trigonometry, logarithms, exponents & calculation history",
    component: ScientificCalculator,
  },
  // Finance Group
  {
    id: "emi",
    label: "EMI Calculator",
    category: "Finance",
    icon: Landmark,
    desc: "Monthly loan EMI, total interest & principal chart",
    component: EmiCalculator,
  },
  {
    id: "sip",
    label: "SIP Calculator",
    category: "Finance",
    icon: TrendingUp,
    desc: "Mutual fund wealth creation & growth trend",
    component: SipCalculator,
  },
  {
    id: "eligibility",
    label: "Loan Eligibility",
    category: "Finance",
    icon: ShieldCheck,
    desc: "Max borrowing capacity & debt ratio estimation",
    component: LoanEligibilityCalculator,
  },
  {
    id: "gst",
    label: "GST Calculator",
    category: "Finance",
    icon: Receipt,
    desc: "Tax inclusion & extraction base price breakdown",
    component: GstCalculator,
  },
  {
    id: "salary",
    label: "Salary / In-Hand",
    category: "Finance",
    icon: Wallet,
    desc: "Gross CTC to monthly take-home salary & deductions",
    component: SalaryInHandCalculator,
  },
  {
    id: "compound",
    label: "Compound Interest",
    category: "Finance",
    icon: PiggyBank,
    desc: "Compounding frequency & long-term wealth growth",
    component: CompoundInterestCalculator,
  },
  {
    id: "fdrd",
    label: "FD & RD Calculator",
    category: "Finance",
    icon: Building2,
    desc: "Fixed Deposit & Recurring Deposit maturity value",
    component: FdRdCalculator,
  },
  {
    id: "prepayment",
    label: "Home Loan Prepayment",
    category: "Finance",
    icon: Coins,
    desc: "Interest saved by reducing tenure or monthly EMI",
    component: HomeLoanPrepaymentCalculator,
  },
  // Health & Personal Group
  {
    id: "bmi",
    label: "BMI Calculator",
    category: "Health & Personal",
    icon: Activity,
    desc: "Body Mass Index & category visual gauge scale",
    component: BmiCalculator,
  },
  {
    id: "age",
    label: "Age Calculator",
    category: "Health & Personal",
    icon: Cake,
    desc: "Exact age in Years, Months, Days & birthday countdown",
    component: AgeCalculator,
  },
  {
    id: "datediff",
    label: "Date Difference",
    category: "Health & Personal",
    icon: CalendarDays,
    desc: "Total day count & duration breakdown between dates",
    component: DateDifferenceCalculator,
  },
  // General / Utilities Group
  {
    id: "percentage",
    label: "Percentage Calculator",
    category: "General / Utilities",
    icon: Percent,
    desc: "Multi-use percentage finder & percentage change tool",
    component: PercentageCalculator,
  },
  {
    id: "cgpa",
    label: "CGPA to Percentage",
    category: "General / Utilities",
    icon: GraduationCap,
    desc: "Bi-directional grade point conversion with factor control",
    component: CgpaPercentageCalculator,
  },
  {
    id: "fuel",
    label: "Fuel Cost Calculator",
    category: "General / Utilities",
    icon: Fuel,
    desc: "Journey distance, vehicle mileage & total fuel cost",
    component: FuelCostCalculator,
  },
  {
    id: "discount",
    label: "Discount & Markup",
    category: "General / Utilities",
    icon: Tag,
    desc: "Price reduction savings & markup profit margins",
    component: DiscountMarkupCalculator,
  },
  {
    id: "tip",
    label: "Tip Calculator",
    category: "General / Utilities",
    icon: Coins,
    desc: "Bill splitting & per-person tip breakdown",
    component: TipCalculator,
  },
  {
    id: "unit",
    label: "Unit Converter",
    category: "General / Utilities",
    icon: Scale,
    desc: "Length, weight, temp, speed, area & volume units",
    component: UnitConverter,
  },
];

function CalculatorHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const calcParam = searchParams.get("calc") || "scientific";
  const [activeCalcId, setActiveCalcId] = useState<string>(calcParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (calcParam) {
      setActiveCalcId(calcParam);
    }
  }, [calcParam]);

  const selectCalculator = (id: string) => {
    setActiveCalcId(id);
    const newUrl = id === "scientific" ? "/calculator" : `/calculator?calc=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    CALCULATOR_ITEMS.find((item) => item.id === activeCalcId) ||
    CALCULATOR_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  // Filter items by search query
  const filteredItems = CALCULATOR_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: CalcMenuItem["category"][] = [
    "General Tools",
    "Finance",
    "Health & Personal",
    "General / Utilities",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Banner Header */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <Calculator size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>Calculator Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                17 Tools
              </span>
            </h1>
            <p>Comprehensive suite of financial, health, scientific, and utility calculators with live results</p>
          </div>
        </div>

        {/* Mobile Dropdown Quick Switcher */}
        <select
          className="calc-mobile-menu-select"
          value={activeCalcId}
          onChange={(e) => selectCalculator(e.target.value)}
        >
          {CALCULATOR_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.category}: {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hub Layout Grid: Glass Sidebar + Active Calculator Screen */}
      <div className="calc-hub-grid">
        {/* Glass Sidebar Menu */}
        <aside className="calc-sidebar-card">
          <div className="calc-sidebar-search">
            <Search size={14} className="calc-sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {categories.map((cat) => {
              const catItems = filteredItems.filter((item) => item.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="calc-menu-group">
                  <div className="calc-menu-group-title">
                    <span>{cat}</span>
                    <span className="text-xs text-muted">{catItems.length}</span>
                  </div>

                  {catItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeCalcId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`calc-menu-item ${isActive ? "active" : ""}`}
                        onClick={() => selectCalculator(item.id)}
                      >
                        <div className="calc-menu-item-left">
                          <div className="calc-menu-item-icon">
                            <Icon size={15} />
                          </div>
                          <span className="calc-menu-item-label">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main View Area */}
        <main className="calc-view-card">
          <div className="calc-view-header">
            <div className="calc-view-title">
              <div className="calc-hub-badge-icon">
                <ActiveIcon size={20} />
              </div>
              <div>
                <h2>{currentItem.label}</h2>
                <div className="text-xs text-dim">{currentItem.desc}</div>
              </div>
            </div>
            <span className="calc-category-badge">{currentItem.category}</span>
          </div>

          {/* Active Calculator Component View */}
          <div className="w-full">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export function CalculatorHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading Calculator Hub...</div>}>
      <CalculatorHubContent />
    </Suspense>
  );
}
