import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHelpRequest } from "@/hooks/useHelpRequest";

export const RequestForm = () => {
  const { t } = useTranslation();
  const { comments, setComments, successMessage, sendRequest } = useHelpRequest();

  return (
    <>
      <div className="p-4">
        <Card className="bg-card text-card-foreground border-0 p-6">
          <Textarea
            placeholder={t("help.requestPlaceholder")}
            className="bg-transparent border-0 resize-none min-h-[200px] text-lg placeholder:text-muted-foreground"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Card>
      </div>

      <div className="p-4 flex justify-center">
        <Button 
          onClick={sendRequest} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-8"
          disabled={comments.trim().length < 4}
        >
          {successMessage ? successMessage : <><Send className="mr-2 h-4 w-4" /> {t("help.sendRequest")}</>}
        </Button>
      </div>
    </>
  );
};
