import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, currentSecurityQuestion } = useAuth();

  const [displayedQuestion, setDisplayedQuestion] = useState(null);

  useEffect(() => {
    if (currentSecurityQuestion) {
      setDisplayedQuestion(currentSecurityQuestion.question);
    }
  }, [currentSecurityQuestion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentSecurityQuestion) {
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'Security question not loaded. Please refresh.',
      });
      return;
    }
    setIsLoading(true);
    const success = signIn(name.trim(), password, securityAnswer.trim());
    if (success) {
      toast({ title: 'Login Successful!', description: 'Welcome!' });
      setName('');
      setPassword('');
      setSecurityAnswer('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials or security answer. Please try again.',
      });
      setSecurityAnswer('');
    }
    setIsLoading(false);
  };

  const isSubmitDisabled = isLoading || !displayedQuestion || !name.trim() || !password.trim();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="login-name">Name</Label>
        <Input
          id="login-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your Name"
        />
      </div>
      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      {displayedQuestion && (
        <div className="space-y-2">
          <Label htmlFor="security-answer" className="flex items-center">
            Security Question
          </Label>
          <p className="text-sm text-muted-foreground p-2 bg-slate-50 rounded-md border">{displayedQuestion}</p>
          <Input
            id="security-answer"
            type="text"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
            placeholder="Your Answer"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
      </Button>
    </motion.form>
  );
};

export default LoginForm;
