-- Match MySQL ON UPDATE CURRENT_TIMESTAMP for changed rows.
CREATE FUNCTION set_row_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW IS DISTINCT FROM OLD AND NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at THEN
    NEW.updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();
--> statement-breakpoint
CREATE TRIGGER cranes_set_updated_at
BEFORE UPDATE ON cranes
FOR EACH ROW EXECUTE FUNCTION set_row_updated_at();
