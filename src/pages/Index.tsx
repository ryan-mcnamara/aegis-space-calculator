import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Clock, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Aegis Space Calculator</h1>
          <Button asChild variant="outline">
            <Link to="/calculator">Start Calculator</Link>
          </Button>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Navigate U.S. Space Regulations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few simple questions to discover which agencies to contact, 
              expected timelines, and estimated regulatory costs for your space mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <Calculator className="w-8 h-8 text-primary mx-auto" />
                <CardTitle>Smart Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Answer targeted yes/no questions to identify exactly which agencies govern your mission.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-primary mx-auto" />
                <CardTitle>Timeline Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get realistic timelines for approval processes from FCC, FAA, NOAA, and other agencies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="w-8 h-8 text-primary mx-auto" />
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Understand licensing fees and regulatory costs before you apply.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="pt-8">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/calculator">Start the Calculator</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
