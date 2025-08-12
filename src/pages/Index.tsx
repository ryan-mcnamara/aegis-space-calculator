import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Space Regulatory Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Answer a few yes/no questions to see which agencies to contact, expected timelines, and estimated regulatory costs.
        </p>
        <div>
          <Button asChild>
            <Link to="/calculator">Start the Calculator</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
