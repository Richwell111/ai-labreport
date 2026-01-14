"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  StickyNote,
  Upload,
  Plus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Dummy data for starter template
const dummyReports = [
  {
    id: "1",
    file_name: "Complete Blood Count - Jan 2024.pdf",
    uploaded_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    file_name: "Lipid Panel - Dec 2023.pdf",
    uploaded_at: "2023-12-10T14:20:00Z",
  },
  {
    id: "3",
    file_name: "Metabolic Panel - Nov 2023.pdf",
    uploaded_at: "2023-11-05T09:15:00Z",
  },
];

const dummyNotes = [
  {
    id: "1",
    title: "Annual Physical Notes",
    created_at: "2024-01-20T11:00:00Z",
  },
  {
    id: "2",
    title: "Medication Schedule",
    created_at: "2024-01-10T16:45:00Z",
  },
  {
    id: "3",
    title: "Doctor Appointment Reminder",
    created_at: "2024-01-05T08:30:00Z",
  },
];

export default function Home() {
  const stats = {
    labReports: dummyReports.length,
    notes: dummyNotes.length,
    recentReports: dummyReports,
    recentNotes: dummyNotes,
  };



  return (
    <div className="space-y-6">
      <>
          {/* Recent Lab Reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Lab Reports</h2>
              <Link href="/lab-reports">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </Link>
            </div>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-0">
                {stats.recentReports.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {stats.recentReports.slice(0, 3).map((report) => (
                      <Link
                        key={report.id}
                        href="/lab-reports"
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {report.file_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  report.uploaded_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No lab reports yet
                    </p>
                    <Link href="/lab-reports">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your First Report
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Notes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Notes</h2>
              <Link href="/notes">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </Link>
            </div>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-0">
                {stats.recentNotes.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {stats.recentNotes.slice(0, 3).map((note) => (
                      <Link
                        key={note.id}
                        href="/notes"
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <StickyNote className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {note.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(note.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No notes yet
                    </p>
                    <Link href="/notes">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Note
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
    </div>
  );
}
