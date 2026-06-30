"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { SystemSettings } from "@/types/admin";
import { Save, AlertOctagon, RefreshCw } from "lucide-react";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.getSystemSettings();
        if (res.success) setSettings(res.settings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await adminApi.updateSystemSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (
    section: keyof SystemSettings,
    key: string,
    value: any,
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    });
  };

  if (loading || !settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            System Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Master control panel for platform parameters and kill-switches.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm text-green-600 font-medium">
              Changes saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50 gap-2 w-full sm:w-auto"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Configuration
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Critical Systems */}
        <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50 flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Critical Systems</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Maintenance Mode
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Activating this will display a global banner to all non-admin
                  users and halt new transactions.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) =>
                    updateSetting(
                      "general",
                      "maintenanceMode",
                      e.target.checked,
                    )
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">General Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) =>
                  updateSetting("general", "platformName", e.target.value)
                }
                className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) =>
                  updateSetting("general", "supportEmail", e.target.value)
                }
                className="mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Financial & Payouts */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Financial & Payouts</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platform Fee (%)
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  value={settings.financial.platformFeePercent}
                  onChange={(e) =>
                    updateSetting(
                      "financial",
                      "platformFeePercent",
                      parseFloat(e.target.value),
                    )
                  }
                  className="block w-full rounded-md border-0 py-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payout Schedule
              </label>
              <select
                value={settings.financial.payoutSchedule}
                onChange={(e) =>
                  updateSetting("financial", "payoutSchedule", e.target.value)
                }
                className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Threshold ($)
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={settings.financial.minPayoutThreshold}
                  onChange={(e) =>
                    updateSetting(
                      "financial",
                      "minPayoutThreshold",
                      parseInt(e.target.value),
                    )
                  }
                  className="block w-full rounded-md border-0 py-2 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Moderation Policies */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Moderation Policies</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Auto-Approve Organizers
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Skip manual review for new organizer accounts.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.moderation.autoApproveOrganizers}
                  onChange={(e) =>
                    updateSetting(
                      "moderation",
                      "autoApproveOrganizers",
                      e.target.checked,
                    )
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automated Flagging Sensitivity
              </label>
              <select
                value={settings.moderation.flaggingSensitivity}
                onChange={(e) =>
                  updateSetting(
                    "moderation",
                    "flaggingSensitivity",
                    e.target.value,
                  )
                }
                className="block w-full max-w-xs rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm"
              >
                <option value="Low">Low (Fewer false positives)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="Strict">Strict (Aggressive flag rate)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
